import { Router } from "express";
import createPayment from "./create";

const router = Router();

router.post("/", createPayment);

export default router;
