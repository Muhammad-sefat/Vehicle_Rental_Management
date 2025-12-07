import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";
import { userRoutes } from "./modules/user/user.route";
import { bookingRoutes } from "./modules/booking/booking.route";
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

// user api
app.use("/api/v1/users", userRoutes);

// booking api
app.use("/api/v1/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
