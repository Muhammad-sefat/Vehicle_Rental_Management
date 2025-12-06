import config from ".";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: `${config.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
         id SERIAL PRIMARY KEY,
         name VARCHAR(100) NOT NULL,
         email VARCHAR(150) NOT NULL UNIQUE,
         password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
         phone VARCHAR(50) NOT NULL,
         role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

  await pool.query(`
       CREATE TABLE IF NOT EXISTS vehicles (
         id SERIAL PRIMARY KEY,
         vehicle_name VARCHAR(150) NOT NULL,
         type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
         registration_number VARCHAR(100) NOT NULL UNIQUE,
         daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
         availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
        `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id),
      vehicle_id INT NOT NULL REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC NOT NULL CHECK (total_price > 0),
      status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
};

export default initDB;
