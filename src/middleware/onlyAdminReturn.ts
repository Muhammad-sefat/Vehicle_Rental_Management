import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const onlyAdminReturn = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.status !== "returned") {
      return next();
    }
    const token = req.headers.authorization?.split(" ")[1];
    const user: any = jwt.verify(token!, config.JWT_SECRET as string);

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can return booking",
      });
    }

    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default onlyAdminReturn;
