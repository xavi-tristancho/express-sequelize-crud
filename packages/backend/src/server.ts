import "./environment";
import "./database";

import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";

import cars from "./domains/car/endpoints";
import images from "./domains/images/upload";

const app = express();

app.use(cors());
app.use(json());
app.use(morgan("combined"));

app.use("/cars", cars);
app.use("/images", images);

const serverPort = process.env.PORT || 3001;

app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
