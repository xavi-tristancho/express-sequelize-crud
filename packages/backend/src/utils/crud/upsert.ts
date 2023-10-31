import { GenericHandler, Header } from "@backend/types";
import { UpsertBody, UpsertResponse, UpsertPathParams } from "./types";
import {
  upsert,
  upsertHasManyRelations,
  upsertBelongsToRelations,
  upsertBelongsToManyRelations,
} from "./upsert-utils";

export default ({ database }: Header) =>
  async ({
    body,
    pathParameters,
  }: GenericHandler<
    UpsertBody,
    null,
    UpsertPathParams | null
  >): Promise<UpsertResponse> => {
    const { Model } = database;

    //Upsert BelongsTo relations
    const belongsToRelations = await upsertBelongsToRelations({
      Model,
      body,
    });

    const data = await upsert({
      id: pathParameters?.id ? parseInt(pathParameters?.id) : undefined,
      body: {
        ...body,
        ...Object.keys(belongsToRelations).reduce((reducer, name) => {
          return {
            ...reducer,
            [Model.associations[name].foreignKey]:
              // @ts-ignore
              belongsToRelations[name][
                Model.associations[name].target.primaryKeyAttribute
              ],
          };
        }, []),
      },
      Model,
    });

    //Upsert BelongsToMany relations
    const belongsToManyRelations = await upsertBelongsToManyRelations({
      Model,
      data,
      body,
    });

    //Upsert HasMany relations
    const hasManyRelations = await upsertHasManyRelations({
      Model,
      data,
      body,
    });

    return {
      statusCode: 200,
      body: {
        data: {
          ...hasManyRelations,
          ...belongsToRelations,
          ...belongsToManyRelations,
          ...data.dataValues ? data.dataValues : data,
        },
      },
    };
  };
