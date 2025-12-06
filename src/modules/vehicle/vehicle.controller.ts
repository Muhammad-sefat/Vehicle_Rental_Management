import { Request, Response } from "express";
import {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
} from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = await createVehicleService(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const data = await getAllVehiclesService();

    return res.status(200).json({
      success: true,
      message:
        data.length > 0
          ? "Vehicles retrieved successfully"
          : "No vehicles found",
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const data = await getVehicleByIdService(Number(req.params.vehicleId));

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const data = await updateVehicleService(
      Number(req.params.vehicleId),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await deleteVehicleService(Number(req.params.vehicleId));

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
