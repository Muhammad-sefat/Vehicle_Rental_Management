import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import {
  createBooking,
  getBookings,
  updateBooking,
} from "./booking.controller";
import onlyAdminReturn from "../../middleware/onlyAdminReturn";

const router = Router();

// Create booking
router.post("/", verifyToken(), createBooking);

// Get bookings
router.get("/", verifyToken(), getBookings);

// Update booking
router.put("/:bookingId", verifyToken(), onlyAdminReturn, updateBooking);

export const bookingRoutes = router;
