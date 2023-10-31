import { vi, describe, it, expect } from "vitest";
import { ModelStatic, Model } from "sequelize";
import upsert from "./upsert";

const mockedModel = vi.fn() as unknown as ModelStatic<Model>;
const mockedUpdate = vi.fn();
const mockedCreate = vi.fn();
mockedModel.update = mockedUpdate;
mockedModel.create = mockedCreate;
// @ts-ignore
mockedModel.associations = {
  booking: {
    target: mockedModel,
  },
};

describe("regarding the upsert function", () => {
  describe("given an existing resource", () => {
    it("should call the update function with the correct parameters", async () => {
      mockedUpdate.mockResolvedValueOnce([true]);

      const response = await upsert({
        database: { Model: mockedModel, primaryKey: "id" },
      })({
        body: { hotelId: "1" },
        queryParameters: null,
        pathParameters: { id: "1" },
      });

      expect(mockedUpdate).toHaveBeenCalledWith(
        { id: "1", hotelId: "1" },
        {
          where: { id: "1", hotelId: "1" },
        }
      );

      expect(response).toEqual({
        statusCode: 200,
        body: {
          data: {
            hotelId: "1",
            id: "1",
          },
        },
      });
    });
  });

  describe("given a non-existing resource", () => {
    it("should call the create function with the correct parameters", async () => {
      mockedCreate.mockResolvedValueOnce({ id: "1", hotelId: "1" });

      const response = await upsert({
        database: { Model: mockedModel, primaryKey: "id" },
      })({
        body: { hotelId: "1" },
        queryParameters: null,
        pathParameters: null,
      });

      expect(mockedCreate).toHaveBeenCalledWith({ hotelId: "1" });

      expect(response).toEqual({
        statusCode: 200,
        body: {
          data: {
            hotelId: "1",
            id: "1",
          },
        },
      });
    });

    describe("give a resource with some relations", () => {
      it("should also create those related resources", async () => {
        const pmsIdentifier = "XR12345";
        mockedCreate.mockResolvedValueOnce({
          id: "1",
          hotelId: "1",
          pmsIdentifier,
        });
        mockedCreate.mockResolvedValueOnce({
          id: "1",
          hotelId: "1",
          bookingId: "1",
        });

        const response = await upsert({
          database: {
            Model: mockedModel,
            primaryKey: "id",
            relations: [
              { name: "booking", fk: "bookingId", Model: mockedModel },
            ],
          },
        })({
          body: { hotelId: "1", booking: { hotelId: "1", pmsIdentifier } },
          queryParameters: null,
          pathParameters: null,
        });

        expect(mockedCreate).toHaveBeenCalledWith({
          hotelId: "1",
          pmsIdentifier,
        });

        expect(response).toEqual({
          statusCode: 200,
          body: {
            data: {
              hotelId: "1",
              id: "1",
              bookingId: "1",
            },
          },
        });
      });

      describe("if no relations are provided", () => {
        it("should only create the main entity", async () => {
          mockedCreate.mockResolvedValueOnce({
            id: "1",
            hotelId: "1",
            bookingId: "1",
          });

          const response = await upsert({
            database: {
              Model: mockedModel,
              primaryKey: "id",
              relations: [
                { name: "booking", fk: "bookingId", Model: mockedModel },
              ],
            },
          })({
            body: { hotelId: "1", bookingId: "1" },
            queryParameters: null,
            pathParameters: null,
          });

          expect(response).toEqual({
            statusCode: 200,
            body: {
              data: {
                hotelId: "1",
                id: "1",
                bookingId: "1",
              },
            },
          });
        });
      });
    });
  });
});
