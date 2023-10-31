import { vi } from "vitest";
import { Response } from "express";
import { CustomRequest } from "@backend/types";

export const mockRequest = () => {
  const req = {} as CustomRequest;

  req.body = {};
  req.query = {};
  req.params = {};

  return req;
};

export const mockResponse = () => {
  const res = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);

  return res;
};
