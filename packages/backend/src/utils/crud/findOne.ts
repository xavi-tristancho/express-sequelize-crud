import { GenericHandler, Header } from "@backend/types";
import {
  FindOneResponse,
  FindOnePathParams,
  FindOneQueryParams,
} from "./types";

export default (header: Header) =>
  async ({
    queryParameters,
    pathParameters,
  }: GenericHandler<
    void,
    FindOneQueryParams,
    FindOnePathParams
  >): Promise<FindOneResponse> => {
    const { id } = pathParameters;
    const { database, findOne } = header;
    const { Model, primaryKey } = database;

    const data = await Model.findOne({
      where: {
        [primaryKey]: id,
      },
      ...findOne?.options,
    });

    if (!data) {
      return {
        statusCode: 404,
        body: {
          message: "Not Found",
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        data,
      },
    };
  };
