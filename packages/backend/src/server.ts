import "./environment";

import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";

import products from "./domains/products/endpoints";
import payments from "./domains/payments/endpoints";

const app = express();

app.use(cors());
app.use(json());
app.use(morgan("combined"));

app.use("/products", products);
app.use("/payments", payments);

const serverPort = process.env.PORT || 3001;

app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
