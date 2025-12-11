import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: Transporter;
  private fromAddress: string;
  private isConfigured: boolean;

  constructor(config?: EmailConfig) {
    const emailConfig = config || this.loadConfigFromEnv();

    this.fromAddress = `"${emailConfig.from.name}" <${emailConfig.from.email}>`;

    this.transporter = nodemailer.createTransporter({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    this.isConfigured = !!(
      emailConfig.host &&
      emailConfig.auth.user &&
      emailConfig.auth.pass
    );

    if (!this.isConfigured) {
      console.warn(
        "[EmailService] Email service not fully configured. Emails will not be sent."
      );
    }
  }

  private loadConfigFromEnv(): EmailConfig {
    return {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASSWORD || "",
      },
      from: {
        name: process.env.EMAIL_FROM_NAME || "Portfolio System",
        email: process.env.EMAIL_FROM_ADDRESS || "noreply@portfolio.dev",
      },
    };
  }

  async send(payload: EmailPayload): Promise<SentMessageInfo | null> {
    if (!this.isConfigured) {
      console.warn(
        "[EmailService] Skipping email send - service not configured"
      );
      return null;
    }

    try {
      const mailOptions: SendMailOptions = {
        from: this.fromAddress,
        to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        cc: payload.cc,
        bcc: payload.bcc,
        attachments: payload.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log("[EmailService] Email sent successfully:", {
        messageId: info.messageId,
        to: payload.to,
        subject: payload.subject,
      });

      return info;
    } catch (error) {
      console.error("[EmailService] Error sending email:", error);
      throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
  }

  async sendWelcomeEmail(
    to: string,
    userName: string
  ): Promise<SentMessageInfo | null> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Portfolio System!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Thank you for registering with our portfolio system. We're excited to have you on board!</p>
            <p>Your account has been successfully created and is ready to use. You can now:</p>
            <ul>
              <li>Create and manage your professional portfolio</li>
              <li>Showcase your projects and skills</li>
              <li>Connect with potential clients and employers</li>
            </ul>
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>© 2025 Portfolio System. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to,
      subject: "Welcome to Portfolio System",
      html,
      text: `Hi ${userName},\n\nThank you for registering with our portfolio system. Your account has been successfully created.\n\nVisit ${
        process.env.FRONTEND_URL || "http://localhost:5173"
      } to get started.\n\n© 2025 Portfolio System`,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string
  ): Promise<SentMessageInfo | null> {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </div>
            <p>Or copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>© 2025 Portfolio System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to,
      subject: "Password Reset Request - Portfolio System",
      html,
      text: `Password Reset Request\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© 2025 Portfolio System`,
    });
  }

  async sendNewsletterEmail(
    to: string[],
    subject: string,
    content: string
  ): Promise<SentMessageInfo | null> {
    return this.send({
      bcc: to,
      subject,
      html: content,
      text: content.replace(/<[^>]*>/g, ""),
    });
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log("[EmailService] Connection verified successfully");
      return true;
    } catch (error) {
      console.error("[EmailService] Connection verification failed:", error);
      return false;
    }
  }

  async close(): Promise<void> {
    this.transporter.close();
  }
}

export const emailService = new EmailService();
