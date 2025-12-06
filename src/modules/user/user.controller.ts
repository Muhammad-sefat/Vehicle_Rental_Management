import { Request, Response } from "express";
import {
  getAllUsersService,
  updateUserService,
  deleteUserService,
} from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await getAllUsersService();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    // Admin or own profile access
    const loggedUser = req.user!;
    if (loggedUser.role !== "admin" && loggedUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot update this user",
      });
    }

    const updated = await updateUserService(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    await deleteUserService(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
