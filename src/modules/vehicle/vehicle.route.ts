import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "./vehicle.controller";
import isAdmin from "../../middleware/isAdmin";

const router = Router();

// Admin Only
router.post("/", isAdmin(), createVehicle);
router.put("/:vehicleId", isAdmin(), updateVehicle);
router.delete("/:vehicleId", isAdmin(), deleteVehicle);

// Public Routes
router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);

export const vehicleRoutes = router;
