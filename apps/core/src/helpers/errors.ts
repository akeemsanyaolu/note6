import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type ErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

const buildErrorResponse = (
  status: ContentfulStatusCode,
  code: string,
  message: string
) => {
  const body: ErrorBody = { error: { code, message } };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
};

const httpError = (
  status: ContentfulStatusCode,
  code: string,
  defaultMessage: string,
  message?: string
) =>
  new HTTPException(status, {
    message: message ?? defaultMessage,
    res: buildErrorResponse(status, code, message ?? defaultMessage),
  });

export const badRequest = (message?: string) =>
  httpError(400, "BAD_REQUEST", "Bad request.", message);

export const unauthorized = (message?: string) =>
  httpError(401, "UNAUTHORIZED", "Authentication is required.", message);

export const forbidden = (message?: string) =>
  httpError(403, "FORBIDDEN", "You do not have access to this resource.", message);

export const notFound = (message?: string) =>
  httpError(404, "NOT_FOUND", "Resource not found.", message);
