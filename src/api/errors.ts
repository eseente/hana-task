export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "ABORTED"
  | "HTTP_ERROR"
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  details?: string;

  constructor(message: string, code: ApiErrorCode, status?: number, details?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
