import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Token missing",
        });
      }

      const token = authHeader.split(" ")[1] as string;

      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string
      ) as JwtPayload;

      req.user = decoded;

      if (decoded.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Admin access required",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default verifyToken;
