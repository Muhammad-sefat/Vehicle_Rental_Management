import { pool } from "../../config/db";

const formatDate = (date: any) => {
  return new Date(date).toISOString().split("T")[0];
};

// Create booking
export const createBookingService = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  // Check vehicle exists + availability
  const vehicle = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicle.rows.length === 0) throw new Error("Vehicle not found");

  const v = vehicle.rows[0];

  if (v.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // Calculate days
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (end <= start) throw new Error("End date must be after start date");

  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const total_price = days * Number(v.daily_rent_price);

  // Create booking
  const booking = await pool.query(
    `INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to booked
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    id: booking.rows[0].id,
    customer_id: booking.rows[0].customer_id,
    vehicle_id: booking.rows[0].vehicle_id,
    rent_start_date: formatDate(booking.rows[0].rent_start_date),
    rent_end_date: formatDate(booking.rows[0].rent_end_date),
    total_price: Number(booking.rows[0].total_price),
    status: booking.rows[0].status,

    vehicle: {
      vehicle_name: v.vehicle_name,
      daily_rent_price: v.daily_rent_price,
    },
  };
};

// GET ALL BOOKINGS
export const getBookingsService = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT b.*, 
        u.name AS customer_name, u.email AS customer_email,
        v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `);

    return result.rows.map((item) => ({
      id: item.id,
      customer_id: item.customer_id,
      vehicle_id: item.vehicle_id,
      rent_start_date: item.rent_start_date,
      rent_end_date: item.rent_end_date,
      total_price: item.total_price,
      status: item.status,
      customer: {
        name: item.customer_name,
        email: item.customer_email,
      },
      vehicle: {
        vehicle_name: item.vehicle_name,
        registration_number: item.registration_number,
      },
    }));
  }

  // Customer view
  const result = await pool.query(
    `
    SELECT b.*, v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    `,
    [user.id]
  );

  return result.rows.map((item) => ({
    id: item.id,
    vehicle_id: item.vehicle_id,
    rent_start_date: item.rent_start_date,
    rent_end_date: item.rent_end_date,
    total_price: item.total_price,
    status: item.status,
    vehicle: {
      vehicle_name: item.vehicle_name,
      registration_number: item.registration_number,
      type: item.type,
    },
  }));
};

// Update booking
export const updateBookingService = async (
  bookingId: number,
  payload: any,
  user: any
) => {
  const { status } = payload;

  if (!status) throw new Error("Status is required");

  // Fetch booking
  const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (booking.rows.length === 0) throw new Error("Booking not found");

  const b = booking.rows[0];

  // Customer can ONLY cancel before start date
  if (status === "cancelled") {
    if (user.role !== "admin" && user.id !== b.customer_id) {
      throw new Error("You cannot cancel this booking");
    }

    const now = new Date();
    const start = new Date(b.rent_start_date);

    if (now > start) {
      throw new Error("Cannot cancel booking after rental start date");
    }

    await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [
      bookingId,
    ]);

    return { ...b, status: "cancelled" };
  }

  // Admin marks as returned
  if (status === "returned") {
    if (user.role !== "admin") throw new Error("Only admin can return booking");

    await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [
      bookingId,
    ]);

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [b.vehicle_id]
    );

    return {
      ...b,
      status: "returned",
      vehicle: {
        availability_status: "available",
      },
    };
  }

  throw new Error("Invalid status");
};
