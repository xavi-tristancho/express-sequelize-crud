import { FindOptions } from "sequelize";
import { Router } from "express";
import { Header } from "@backend/types";
import handler from "@backend/utils/endpoints/handler";
import findOne from "@backend/utils/crud/findOne";
import findAll from "@backend/utils/crud/findAll";
import upsert from "@backend/utils/crud/upsert";
import deleteOne from "@backend/utils/crud/delete";
import { upsertBodySchema } from "./schemas";
import Car from "@backend/domains/car/models/car";
import Brand from "@backend/domains/brand/models/brand";

const optionsFindAll: FindOptions = {
  include: [{ model: Brand, as: "brand" }],
};

const optionsFindOne: FindOptions = {
  include: [],
};

const header: Header = {
  database: {
    Model: Car,
    primaryKey: "id",
  },
  findAll: {
    options: optionsFindAll,
  },
  findOne: {
    options: optionsFindOne,
  },
};

const router = Router();

router.get("/", handler(findAll(header)));
router.get("/:id", handler(findOne(header)));
router.post("/", handler(upsert(header), { bodySchema: upsertBodySchema }));
router.patch("/:id", handler(upsert(header), { bodySchema: upsertBodySchema }));
router.delete("/:id", handler(deleteOne(header)));

export default router;
