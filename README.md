# Backend API - Authentication System

Backend API untuk sistem login dan register menggunakan **Express.js**, **JWT**, **MySQL**, dan **bcrypt**.

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- XAMPP (MySQL)
- Git (opsional)

## 🚀 Cara Install & Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Database

1. Buka **XAMPP Control Panel**
2. Start **Apache** dan **MySQL**
3. Buka **phpMyAdmin** (http://localhost/phpmyadmin)
4. Buat database baru dengan nama `auth_system`:
   ```sql
   CREATE DATABASE auth_system;
   ```

### 3. Konfigurasi Environment Variables

File `.env` sudah dibuat otomatis. Pastikan konfigurasi sesuai dengan XAMPP Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_system
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

PORT=3000
```

**⚠️ PENTING**: Ganti `JWT_SECRET` dengan key rahasia Anda sendiri untuk production!

### 4. Jalankan Server

**Development mode (dengan nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

## 📊 Database Schema

Tabel `users` akan dibuat otomatis saat server pertama kali dijalankan:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### 1. **Register User Baru**

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "userId": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe"
  }
}
```

**Response Error (409 - Email sudah terdaftar):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

### 2. **Login**

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "password": "password123"
}
```

> **Note:** `identifier` bisa berupa email atau username

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "full_name": "John Doe"
    }
  }
}
```

**Response Error (401 - Kredensial salah):**
```json
{
  "success": false,
  "message": "Email/Username atau password salah"
}
```

### 3. **Get Profile (Protected)**

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response Error (401 - Token tidak ada):**
```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

### 4. **Test Endpoint**

**Endpoint:** `GET /api/auth/test`

**Response:**
```json
{
  "success": true,
  "message": "Auth API is working!",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

## 🧪 Testing dengan Postman/Thunder Client

### 1. Register User Baru
- Method: `POST`
- URL: `http://localhost:3000/api/auth/register`
- Body (JSON):
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User"
  }
  ```

### 2. Login
- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Body (JSON):
  ```json
  {
    "identifier": "test@example.com",
    "password": "test123"
  }
  ```
- Copy token dari response

### 3. Get Profile (dengan token)
- Method: `GET`
- URL: `http://localhost:3000/api/auth/profile`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer <paste_token_here>`

## 📁 Struktur Project

```
backend/
├── config/
│   └── db.js                 # Konfigurasi koneksi MySQL
├── controller/
│   ├── login.js              # Controller untuk login & profile
│   └── register.js           # Controller untuk register
├── middleware/
│   └── index.js              # Middleware untuk auth JWT
├── models/
│   ├── login.js              # Model untuk login
│   └── register.js           # Model untuk register & create table
├── routes/
│   └── loginRoute.js         # Routes untuk auth endpoints
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── index.js                  # Main server file
├── package.json              # Dependencies
└── README.md                 # Dokumentasi
```

## 🔒 Keamanan

- Password di-hash menggunakan **bcrypt** dengan salt rounds 10
- JWT token untuk autentikasi
- Validasi input di middleware dan controller
- Environment variables untuk sensitive data
- CORS enabled

## ⚙️ Teknologi yang Digunakan

- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication token
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **nodemon** - Development auto-reload

## 🐛 Troubleshooting

### Error: Cannot connect to database
- Pastikan XAMPP MySQL sudah running
- Cek konfigurasi di file `.env`
- Pastikan database `auth_system` sudah dibuat

### Error: Port already in use
- Ganti PORT di file `.env` ke port lain (misal 3001)
- Atau matikan aplikasi yang menggunakan port 3000

### Error: Token expired
- Token valid selama 24 jam (default)
- Login ulang untuk mendapatkan token baru

## 📝 Notes

- Tabel `users` akan dibuat otomatis saat pertama kali server dijalankan
- Password minimal 6 karakter
- Email dan username harus unik
- Token JWT valid selama 24 jam (bisa diubah di `.env`)

## 👨‍💻 Developer

Developed with ❤️ using Express.js and JWT
