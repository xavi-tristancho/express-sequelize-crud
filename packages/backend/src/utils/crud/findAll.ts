import { Op } from "sequelize";
import { GenericHandler, Header } from "@backend/types";
import { FindAllResponse, FindAllQueryParams, FindAllFilters } from "./types";

export default (header: Header) =>
  async ({
    queryParameters,
  }: GenericHandler<null, FindAllQueryParams>): Promise<FindAllResponse> => {
    const { database, findAll } = header;
    const { Model } = database;

    const {
      limit = 20,
      offset = 0,
      order,
      where: {
        createdAt = undefined,
        updatedAt = undefined,
        ...inputWhere
      } = {},
    } = queryParameters?.filters
      ? (JSON.parse(queryParameters.filters) as FindAllFilters)
      : {
          limit: 20,
          offset: 0,
          order: undefined,
          where: { createdAt: undefined, updatedAt: undefined },
        };

    const where = {
      ...inputWhere,
      ...(createdAt
        ? { createdAt: { [Op.between]: [createdAt.from, createdAt.to] } }
        : {}),
      ...(updatedAt
        ? { updatedAt: { [Op.between]: [updatedAt.from, updatedAt.to] } }
        : {}),
    };

    const data = await Model.findAll({
      where,
      limit,
      offset,
      order,
      ...findAll?.options,
    });

    const count = await Model.count({
      where,
    });

    return {
      statusCode: 200,
      body: {
        data,
        count,
      },
    };
  };
