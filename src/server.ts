import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
const app = express();
const port = config.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is runing!");
});

// db
initDB();

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
