export interface ErrorResponseDTO {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, any>;
    timestamp: string;
    path?: string;
  };
}

export interface SuccessResponseDTO<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export type ApiResponseDTO<T = any> = SuccessResponseDTO<T> | ErrorResponseDTO;
