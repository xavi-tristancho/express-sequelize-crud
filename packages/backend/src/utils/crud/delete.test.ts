import { vi, describe, it, expect } from "vitest";
import { ModelStatic, Model } from "sequelize";
import deleteModel from "./delete";

const mockedModel = vi.fn() as unknown as ModelStatic<Model>;
const mockedDestroy = vi.fn();
mockedModel.destroy = mockedDestroy;

describe("regarding the delete function", () => {
  describe("given an existing resource", () => {
    it("should call the destroy function with the correct parameters", async () => {
      mockedDestroy.mockResolvedValueOnce(1);

      const response = await deleteModel({
        database: { Model: mockedModel, primaryKey: "id" },
      })({
        body: null,
        queryParameters: { hotelId: "1" },
        pathParameters: { id: "1" },
      });

      expect(mockedDestroy).toHaveBeenCalledWith({
        where: { id: "1", hotelId: "1" },
      });

      expect(response).toEqual({ statusCode: 204, body: null });
    });
  });

  describe("given a non-existing resource", () => {
    it("should return a 404", async () => {
      mockedDestroy.mockResolvedValueOnce(0);

      const response = await deleteModel({
        database: { Model: mockedModel, primaryKey: "id" },
      })({
        body: null,
        queryParameters: { hotelId: "1" },
        pathParameters: { id: "1" },
      });

      expect(response).toEqual({
        statusCode: 404,
        body: { message: "Resource not found" },
      });
    });
  });
});
