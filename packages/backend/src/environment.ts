const env = process.env.NODE_ENV;
import { config } from "dotenv";

config({ path: `.env.${env}` });
