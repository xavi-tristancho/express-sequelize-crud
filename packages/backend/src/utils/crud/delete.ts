import type { GenericHandler, Header } from "@backend/types";
import { DeleteResponse, DeleteQueryParams, FindOnePathParams } from "./types";

export default (header: Header) =>
  async ({
    pathParameters,
  }: GenericHandler<
    null,
    DeleteQueryParams,
    FindOnePathParams
  >): Promise<DeleteResponse> => {
    const { id } = pathParameters;
    const { Model } = header.database;

    const result = await Model.destroy({
      where: { id },
    });

    if (result === 0) {
      return {
        statusCode: 404,
        body: {
          message: "Resource not found",
        },
      };
    }

    return {
      statusCode: 204,
      body: null,
    };
  };
