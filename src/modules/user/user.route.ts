import { Router } from "express";
import { getAllUsers, updateUser, deleteUser } from "./user.controller";
import isAdmin from "../../middleware/isAdmin";
import verifyToken from "../../middleware/verifyToken";

const router = Router();

router.get("/", isAdmin(), getAllUsers);
router.put("/:userId", verifyToken(), updateUser);
router.delete("/:userId", isAdmin(), deleteUser);

export const userRoutes = router;
