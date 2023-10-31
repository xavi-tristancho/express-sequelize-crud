import { Order, WhereOptions } from "sequelize";
import { ApiResponse, MessageResponse } from "@backend/types";

export type FindAllResponse = ApiResponse<{
  data: unknown[];
  count: number;
}>;

export type FindAllQueryParams = {
  filters?: string;
};

export type FindAllFilters = {
  limit?: number;
  offset?: number;
  order?: Order;
  where?: WhereOptions & {
    createdAt: { from: string; to: string };
    updatedAt: { from: string; to: string };
  };
};

export type FindOneQueryParams = {};

export type FindOnePathParams = {
  id: string;
};

export type FindOneResponse = ApiResponse<
  | {
      data: unknown;
    }
  | MessageResponse
>;

export type UpsertResponse = ApiResponse<
  | {
      data: unknown;
    }
  | MessageResponse
>;

export type UpsertBody = {
  id?: number;
  [key: string]: unknown;
};
export type UpsertPathParams = { id: string };

export type DeleteResponse =
  | ApiResponse<null, 204 | 404>
  | ApiResponse<MessageResponse>;

export type DeleteQueryParams = {};
