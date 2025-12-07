
## 🚗 Vehicle Rental Management System

A complete backend API for managing vehicle rentals, built with Node.js, TypeScript, Express, and PostgreSQL.

### 🌐 Live API URL

👉 Add here later

### Features

🔐 Authentication

📝 User Registration (Customer/Admin)

🔑 User Login (JWT-Based)

🔒 Role-Based Access (Admin / Customer)

🚙 Vehicle Management (Admin Only)

➕ Create Vehicle

📄 Get All Vehicles

🔍 Get Single Vehicle

✏️ Update Vehicle

🗑️ Delete Vehicle (if no active bookings)

👤 User Management

📄 Get All Users (Admin Only)

✏️ Update User (Admin or Own Profile)

🗑️ Delete User (Admin Only)

📖 Booking Management

🆕 Create Booking (Customer/Admin)

📄 Get Bookings


### 🛠 Tech Stack

🟩 Node.js	Runtime environment

📘 TypeScript	Type safety & cleaner code

🚀 Express.js	Web framework

🐘 PostgreSQL	Database

🔐 bcrypt	Password hashing

🎟 jsonwebtoken (JWT)	Authentication

🗂 pg (node-postgres)	Database client


### ⚙️ Setup Instructions

1️⃣ Clone the Repository
git clone <your-repo-url>
cd vehicle-rental-management

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

#### Create a .env file:

PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>
JWT_SECRET=your_secret_key

4️⃣ Start the Development Server
npm run dev


Your API is now live at:

http://localhost:5000

#### 🚀 Usage Instructions

- Register: POST /api/v1/auth/signup

- Login: POST /api/v1/auth/signin


#### 🚗 Vehicles

- Create Vehicle: POST /api/v1/vehicles (Admin)

- Get All: GET /api/v1/vehicles

- Get One: GET /api/v1/vehicles/:id

- Update: PUT /api/v1/vehicles/:id (Admin)

- Delete: DELETE /api/v1/vehicles/:id (Admin)

#### 👤 Users

Get Users: GET /api/v1/users (Admin)

Update User: PUT /api/v1/users/:id (Admin or Own)

Delete User: DELETE /api/v1/users/:id (Admin)

#### 📖 Bookings

- Create: POST /api/v1/bookings

- Get Bookings: GET /api/v1/bookings

- Update Booking: PUT /api/v1/bookings/:id

- Admin → Mark as returned , cancelled

