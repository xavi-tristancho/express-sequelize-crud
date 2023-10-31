import { vi, describe, expect, it } from "vitest";
import { Model, ModelStatic, Op } from "sequelize";
import { Header } from "@backend/types";
import findAll from "./findAll";
import { FindAllFilters } from "./types";

const mockedModel = vi.fn() as unknown as ModelStatic<Model>;
const mockedFindAll = (mockedModel.findAll = vi.fn());
// @ts-ignore
mockedModel.count = vi.fn();

const header: Header = {
  database: {
    Model: mockedModel,
    primaryKey: "id",
  },
  findAll: {
    options: {
      include: "hotel",
    },
  },
};

describe("findAll", () => {
  describe("given some filters on the query parameters", () => {
    it("should apply those filters", async () => {
      const findAllFilters: FindAllFilters = {
        limit: 10,
        offset: 0,
        order: [["createdAt", "DESC"]],
        where: {
          isActive: true,
          createdAt: {
            from: "2020-01-01",
            to: "2020-01-02",
          },
          updatedAt: {
            from: "2020-01-01",
            to: "2020-01-02",
          },
        },
      };

      const queryParameters = {
        filters: JSON.stringify(findAllFilters),
      };

      const expectedData = [{ id: 1 }];

      // @ts-ignore
      mockedFindAll.mockResolvedValueOnce(expectedData);

      const response = await findAll(header)({
        body: null,
        queryParameters,
        pathParameters: null,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(expectedData);
      expect(mockedFindAll).toHaveBeenCalledWith({
        where: {
          isActive: true,
          createdAt: { [Op.between]: ["2020-01-01", "2020-01-02"] },
          updatedAt: { [Op.between]: ["2020-01-01", "2020-01-02"] },
        },
        limit: 10,
        offset: 0,
        order: [["createdAt", "DESC"]],
        include: "hotel",
      });
    });
  });

  describe("given no filters on the query parameters", () => {
    it("should apply default filters", async () => {
      const expectedData = [{ id: 1 }];

      // @ts-ignore
      mockedFindAll.mockResolvedValueOnce(expectedData);

      const response = await findAll(header)({
        body: null,
        queryParameters: {},
        pathParameters: null,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(expectedData);
      expect(mockedFindAll).toHaveBeenCalledWith({
        where: {},
        limit: 20,
        offset: 0,
        order: undefined,
        include: "hotel",
      });
    });
  });
});
