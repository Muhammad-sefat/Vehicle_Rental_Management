import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  CONNECTION_STR: process.env.CONNECTION_STR,
};

export default config;
