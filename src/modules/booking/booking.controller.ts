import { Request, Response } from "express";
import {
  createBookingService,
  getBookingsService,
  updateBookingService,
} from "./booking.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const data = await createBookingService(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const data = await getBookingsService(user);

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const user = req.user!;
    const payload = req.body;

    const data = await updateBookingService(bookingId, payload, user);

    return res.status(200).json({
      success: true,
      message:
        payload.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
