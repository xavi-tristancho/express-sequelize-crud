import { ValidationError } from "sequelize";
import { Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

import { ApiResponse, GenericHandler, MessageResponse } from "@backend/types";

export default function handler<Body, QueryString, PathParameters>(
  fn: (
    args: GenericHandler<Body, QueryString, PathParameters>
  ) => Promise<ApiResponse<Record<string, unknown> | MessageResponse>>,
  validation?: {
    bodySchema?: ZodSchema;
    querySchema?: ZodSchema;
    pathSchema?: ZodSchema;
  }
) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      if (validation?.bodySchema) {
        validation.bodySchema.parse(req.body);
      }

      const { body, statusCode } = await fn({
        body: req.body as Body,
        queryParameters: req.query as QueryString,
        pathParameters: req.params as PathParameters,
      });

      res.status(statusCode).send(body);
    } catch (error) {
      const { statusCode, body } = handleError(error);

      res.status(statusCode).send(body);
    }
  };
}

function handleError(error: unknown): ApiResponse<MessageResponse> {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  if (error instanceof ValidationError) {
    return {
      statusCode: 422,
      body: {
        message: error.message,
      },
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 422,
      body: { message: error.issues },
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      body: {
        message: error.message,
        stack: error.stack,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      message: "Unknown error",
    },
  };
}
