import { Router } from "express";
import findAllProducts from "./findAll";

const router = Router();

router.get("/", findAllProducts);

export default router;
