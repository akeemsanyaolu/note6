import { z } from "@hono/zod-openapi";

export const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  })
  .openapi("ErrorResponse");

export const healthResponseSchema = z
  .object({
    status: z.literal("ok"),
    service: z.literal("core"),
    timestamp: z.string().datetime(),
  })
  .openapi("HealthResponse");

export const jsonSuccessResponse = <T extends z.ZodTypeAny>(
  schema: T,
  status: 200 | 201,
  description: string
) =>
  ({
    [status]: {
      description,
      content: {
        "application/json": {
          schema,
        },
      },
    },
  }) as const;

export const jsonErrorResponse = (
  status: 400 | 401 | 403 | 404 | 409 | 422 | 500,
  description: string
) =>
  ({
    [status]: {
      description,
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  }) as const;

export const responses = {
  ok: <T extends z.ZodTypeAny>(schema: T, description = "OK") =>
    jsonSuccessResponse(schema, 200, description),
  created: <T extends z.ZodTypeAny>(schema: T, description = "Created") =>
    jsonSuccessResponse(schema, 201, description),
  badRequest: jsonErrorResponse(400, "Bad Request"),
  unauthorized: jsonErrorResponse(401, "Unauthorized"),
  forbidden: jsonErrorResponse(403, "Forbidden"),
  notFound: jsonErrorResponse(404, "Not Found"),
};
