import { pool } from "../../config/db";

// CREATE VEHICLE
export const createVehicleService = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new Error("All fields are required");
  }

  const exists = await pool.query(
    "SELECT * FROM vehicles WHERE registration_number = $1",
    [registration_number]
  );

  if (exists.rows.length > 0) {
    throw new Error("Registration number already exists");
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

// GET ALL VEHICLES
export const getAllVehiclesService = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`
  );

  return result.rows;
};

// GET VEHICLE BY ID
export const getVehicleByIdService = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
     FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

// UPDATE VEHICLE
export const updateVehicleService = async (vehicleId: number, payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const existing = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);

  if (existing.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const updated = await pool.query(
    `UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
     WHERE id = $6
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name || null,
      type || null,
      registration_number || null,
      daily_rent_price || null,
      availability_status || null,
      vehicleId,
    ]
  );

  return updated.rows[0];
};

// DELETE VEHICLE
export const deleteVehicleService = async (vehicleId: number) => {
  const exists = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);

  if (exists.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);
};
