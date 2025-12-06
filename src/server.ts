import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";
const app = express();
const port = config.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is runing!");
});

// db
initDB();

// auth api
app.use("/api/v1/auth", authRoutes);

// vehicle api
app.use("/api/v1/vehicles", vehicleRoutes);

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
