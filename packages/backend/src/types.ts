import { Request } from "express";
import { ZodIssue } from "zod";

export type GenericHandler<
  Body = null,
  QueryString = null,
  PathParameters = null
> = {
  body: Body;
  queryParameters: QueryString;
  pathParameters: PathParameters;
};

export type ApiResponse<T, S = 200 | 201 | 400 | 401 | 404 | 422 | 500> = {
  statusCode: S;
  body: T;
};

export type MessageResponse = {
  message: string | ZodIssue[];
  stack?: string;
};

export type CustomRequest = Request;
