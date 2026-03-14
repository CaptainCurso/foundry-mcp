export const ERROR_CODES = {
  approvalExpired: "APPROVAL_EXPIRED",
  approvalMismatch: "APPROVAL_MISMATCH",
  approvalRequired: "APPROVAL_REQUIRED",
  approvalUsed: "APPROVAL_ALREADY_USED",
  bridgeOffline: "BRIDGE_OFFLINE",
  documentNotFound: "DOCUMENT_NOT_FOUND",
  forbiddenField: "FORBIDDEN_FIELD",
  forbiddenOperation: "FORBIDDEN_OPERATION",
  invalidAuth: "INVALID_AUTH",
  invalidPayload: "INVALID_PAYLOAD",
  invalidSession: "INVALID_SESSION",
  moduleError: "MODULE_ERROR",
  timeout: "REQUEST_TIMEOUT",
  unsupportedDocumentType: "UNSUPPORTED_DOCUMENT_TYPE",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class BridgeError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;

  constructor(code: ErrorCode, message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
