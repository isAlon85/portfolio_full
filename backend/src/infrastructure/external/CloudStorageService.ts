import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  HeadObjectCommandInput,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Readable } from "stream";

export interface CloudStorageConfig {
  endpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl?: string;
  forcePathStyle?: boolean;
}

export interface UploadOptions {
  fileName?: string;
  folder?: string;
  contentType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size?: number;
}

export class CloudStorageService {
  private client: S3Client;
  private bucket: string;
  private publicBaseUrl: string;
  private isConfigured: boolean;

  constructor(config?: CloudStorageConfig) {
    const storageConfig = config || this.loadConfigFromEnv();

    this.bucket = storageConfig.bucket;
    this.publicBaseUrl = storageConfig.publicBaseUrl || "";

    this.client = new S3Client({
      endpoint: storageConfig.endpoint,
      region: storageConfig.region,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
      forcePathStyle: storageConfig.forcePathStyle ?? true,
    });

    this.isConfigured = !!(
      storageConfig.accessKeyId &&
      storageConfig.secretAccessKey &&
      storageConfig.bucket
    );

    if (!this.isConfigured) {
      console.warn(
        "[CloudStorageService] Service not fully configured. File operations will fail."
      );
    }
  }

  private loadConfigFromEnv(): CloudStorageConfig {
    return {
      endpoint: process.env.S3_ENDPOINT || undefined,
      region: process.env.S3_REGION || "us-east-1",
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      bucket: process.env.S3_BUCKET || "portfolio-assets",
      publicBaseUrl: process.env.S3_PUBLIC_BASE_URL || "",
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    };
  }

  private generateKey(originalFileName: string, folder?: string): string {
    const ext = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, ext);
    const sanitizedBaseName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();
    const uniqueId = uuidv4().split("-")[0];
    const fileName = `${sanitizedBaseName}-${uniqueId}${ext}`;

    return folder ? `${folder}/${fileName}` : fileName;
  }

  private getPublicUrl(key: string): string {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl}/${key}`;
    }
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async upload(
    file: Buffer | Readable | string,
    originalFileName: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.isConfigured) {
      throw new Error("CloudStorageService is not configured");
    }

    try {
      const key = options.fileName
        ? options.folder
          ? `${options.folder}/${options.fileName}`
          : options.fileName
        : this.generateKey(originalFileName, options.folder);

      const contentType =
        options.contentType || this.getContentType(originalFileName);

      const uploadParams: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: options.isPublic ? "public-read" : "private",
        Metadata: options.metadata || {},
      };

      const command = new PutObjectCommand(uploadParams);
      await this.client.send(command);

      const url = this.getPublicUrl(key);

      console.log("[CloudStorageService] File uploaded successfully:", {
        key,
        url,
      });

      return {
        key,
        url,
        bucket: this.bucket,
      };
    } catch (error) {
      console.error("[CloudStorageService] Upload error:", error);
      throw new Error(`Failed to upload file: ${(error as Error).message}`);
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isConfigured) {
      throw new Error("CloudStorageService is not configured");
    }

    try {
      const deleteParams: DeleteObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
      };

      const command = new DeleteObjectCommand(deleteParams);
      await this.client.send(command);

      console.log("[CloudStorageService] File deleted successfully:", key);
      return true;
    } catch (error) {
      console.error("[CloudStorageService] Delete error:", error);
      throw new Error(`Failed to delete file: ${(error as Error).message}`);
    }
  }

  async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.isConfigured) {
      throw new Error("CloudStorageService is not configured");
    }

    try {
      const getParams: GetObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
      };

      const command = new GetObjectCommand(getParams);
      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });

      return signedUrl;
    } catch (error) {
      console.error(
        "[CloudStorageService] Error generating signed URL:",
        error
      );
      throw new Error(
        `Failed to generate signed URL: ${(error as Error).message}`
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const headParams: HeadObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
      };

      const command = new HeadObjectCommand(headParams);
      await this.client.send(command);

      return true;
    } catch (error: any) {
      if (
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    if (!this.isConfigured) {
      throw new Error("CloudStorageService is not configured");
    }

    try {
      const listParams: ListObjectsV2CommandInput = {
        Bucket: this.bucket,
        Prefix: prefix,
      };

      const command = new ListObjectsV2Command(listParams);
      const response = await this.client.send(command);

      return response.Contents?.map((item) => item.Key || "") || [];
    } catch (error) {
      console.error("[CloudStorageService] List error:", error);
      throw new Error(`Failed to list files: ${(error as Error).message}`);
    }
  }

  private getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".zip": "application/zip",
      ".json": "application/json",
      ".txt": "text/plain",
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
    };

    return contentTypes[ext] || "application/octet-stream";
  }

  getBucket(): string {
    return this.bucket;
  }

  isReady(): boolean {
    return this.isConfigured;
  }
}

export const cloudStorageService = new CloudStorageService();
