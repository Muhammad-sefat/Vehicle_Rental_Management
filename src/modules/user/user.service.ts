import { pool } from "../../config/db";

// GET ALL USERS
export const getAllUsersService = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result.rows;
};

// UPDATE USER (Admin or Own)
export const updateUserService = async (userId: number, payload: any) => {
  const { name, email, phone, role } = payload;

  const existing = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);

  if (existing.rows.length === 0) {
    throw new Error("User not found");
  }

  const updated = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role)
     WHERE id = $5
     RETURNING id, name, email, phone, role`,
    [name || null, email || null, phone || null, role || null, userId]
  );

  return updated.rows[0];
};

// DELETE USER
export const deleteUserService = async (userId: number) => {
  const exists = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    userId,
  ]);

  if (exists.rows.length === 0) {
    throw new Error("User not found");
  }

  // Booking check will be added when bookings module is made

  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
};
