import { Association, Model, ModelStatic } from "sequelize";
import { Header } from "@backend/types";
import { UpsertBody } from "./types";

export async function upsertBelongsToManyRelations({
  Model,
  data,
  body,
}: {
  Model: Header["database"]["Model"];
  data: Model;
  body: UpsertBody;
}) {
  const belongsToManyRelations = await Object.keys(Model.associations)
    ?.filter(
      (name) =>
        body[name] instanceof Array &&
        Model.associations[name].associationType === "BelongsToMany"
    )
    .reduce(async (reducer, name) => {
      const args = {
        // @ts-ignore
        pkValue: data[Model.primaryKeyAttribute],
        // @ts-ignore
        foreignIdentifier: Model.associations[name].foreignIdentifier,
        foreignKey: Model.associations[name].foreignKey,
        // @ts-ignore
        sourceKey: Model.associations[name].sourceKey,
        // @ts-ignore
        Model: Model.associations[name].options.through.model,
        body: body[name] as UpsertBody[],
      };

      const relationData = await upsertBelongsToMany(args);

      return {
        ...reducer,
        [name]: relationData,
      };
    }, Promise.resolve({}));

  return belongsToManyRelations;
}

type UpserBelongsToManyInput = {
  pkValue: string;
  foreignIdentifier: string;
  foreignKey: string;
  sourceKey: string;
  Model: ModelStatic<Model>;
  body: UpsertBody[];
};

async function upsertBelongsToMany({
  pkValue,
  foreignIdentifier,
  foreignKey,
  sourceKey,
  Model,
  body,
}: UpserBelongsToManyInput) {
  const data = await Promise.all(
    body.map((b: UpsertBody) => {
      const args = {
        body: {
          [foreignIdentifier]: b[sourceKey],
          [foreignKey]: pkValue,
        } as UpsertBody,
        Model,
      };

      return upsert(args);
    })
  );

  return data;
}

export async function upsertBelongsToRelations({
  Model,
  body,
}: {
  Model: Header["database"]["Model"];
  body: UpsertBody;
}): Promise<Record<string, ModelStatic<Model>>> {
  const belongsToRelations = await Object.keys(Model.associations)
    ?.filter(
      (name) =>
        body[name] instanceof Object &&
        Model.associations[name].associationType === "BelongsTo"
    )
    .reduce(async (reducer, name) => {
      const relationBody = body[name] as UpsertBody;

      const relationData = await upsertBelongsTo({
        pk: relationBody.id as string | number,
        association: Model.associations[name],
        body: {
          ...relationBody,
          hotelId: body.hotelId,
        },
      });

      return {
        ...reducer,
        [name]: relationData,
      };
    }, Promise.resolve({}));

  return belongsToRelations;
}

type UpserBelongsToInput = {
  pk: string | number;
  association: Association<Model>;
  body: UpsertBody;
};

async function upsertBelongsTo({ association, body }: UpserBelongsToInput) {
  const data = await upsert({
    id: body.id,
    body,
    Model: association.target,
  });

  return data;
}

type UpserHasManyRelationsInput = {
  Model: ModelStatic<Model>;
  data: Model;
  body: UpsertBody;
};

export async function upsertHasManyRelations({
  Model,
  data,
  body,
}: UpserHasManyRelationsInput) {
  const hasManyRelations = await Object.keys(Model.associations)
    ?.filter(
      (name) =>
        body[name] instanceof Array &&
        Model.associations[name].associationType === "HasMany"
    )
    .reduce(async (reducer, name) => {
      const relationBody = body[name] as UpsertBody[];

      const relationData = await upsertHasMany({
        // @ts-ignore
        pk: data[Model.primaryKeyAttribute],
        association: Model.associations[name],
        body: relationBody.map((b) => ({
          ...b,
          hotelId: body.hotelId,
        })) as UpsertBody[],
      });

      return {
        ...reducer,
        [name]: relationData,
      };
    }, Promise.resolve({}));

  return hasManyRelations;
}

type UpserHasManyInput = {
  pk: string;
  association: Association<Model>;
  body: UpsertBody[];
};

async function upsertHasMany({ pk, association, body }: UpserHasManyInput) {
  const data = await Promise.all(
    body.map((body: UpsertBody) =>
      upsert({
        id: body.id,
        body: {
          ...body,
          [association.foreignKey]: pk,
        },
        Model: association.target,
      })
    )
  );

  return data;
}

type UpsertInput = {
  id?: number | undefined;
  body: UpsertBody;
  Model: Header["database"]["Model"];
};

export async function upsert({ id, body, Model }: UpsertInput) {
  const { primaryKeyAttribute } = Model;

  if (id) {
    const [success] = await Model.upsert({
      ...body,
      [primaryKeyAttribute]: id,
      ...(body.hotelId ? { hotelId: body.hotelId } : {}),
    });

    if (!success) throw new Error("Cannot update resource");

    return body as unknown as Model;
  }

  const data = (await Model.upsert(body)) as unknown as Model;

  return data instanceof Array ? data[0] : data;
}
