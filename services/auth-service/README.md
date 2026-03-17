# CreatorPay — Auth Service

The **Auth Service** handles authentication and authorization for the CreatorPay platform.

It provides APIs for:

* User registration
* User login
* JWT authentication
* Password hashing
* Request validation
* Redis-based security protections

The service is designed as an **independent microservice** and communicates with other services through an API Gateway.

---

# Service Overview

| Property          | Value        |
| ----------------- | ------------ |
| Service Name      | auth-service |
| Port              | 4001         |
| Database          | PostgreSQL   |
| Cache             | Redis        |
| Authentication    | JWT          |
| Password Security | bcrypt       |

---

# Architecture

```text
Client
   ↓
Route
   ↓
Rate Limit Middleware (Redis)
   ↓
Validation Middleware
   ↓
Controller
   ↓
Service Layer
   ↓
Repository Layer
   ↓
PostgreSQL
```

---

# Project Structure

```text
auth-service
│
├── src
│
│   ├── config
│   │   ├── db.js
│   │   └ redis.js
│
│   ├── controllers
│   │   └ auth.controller.js
│
│   ├── services
│   │   └ auth.service.js
│
│   ├── repositories
│   │   └ user.repository.js
│
│   ├── routes
│   │   └ auth.routes.js
│
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └ rateLimit.middleware.js
│
│   ├── validators
│   │   └ auth.validator.js
│
│   └ server.js
│
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md
```

---

# Environment Variables

Create a `.env` file.

```
PORT=4001
JWT_SECRET=supersecretkey

DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=creatorpay_auth

REDIS_HOST=redis
REDIS_PORT=6379
```

---

# Database

Database name:

```
creatorpay_auth
```

Users table schema:

```
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 email VARCHAR(255) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Redis Usage

Redis is used for:

* Login rate limiting
* Security protection
* Distributed request tracking

Redis service runs inside Docker.

---

# API Documentation

---

# Health Check

### Endpoint

```
GET /health
```

### Response

```
{
 "service": "auth-service",
 "status": "running"
}
```

---

# Signup

Create a new user.

### Endpoint

```
POST /auth/signup
```

### Headers

```
Content-Type: application/json
```

### Request Body

```
{
 "email": "user@test.com",
 "password": "123456"
}
```

### Success Response

```
201 Created
```

```
{
 "message": "User created successfully",
 "user": {
   "id": 1,
   "email": "user@test.com",
   "created_at": "2026-03-15T18:26:50.445Z"
 }
}
```

### Error Response

Duplicate email:

```
400 Bad Request
```

```
{
 "error": "Email already registered"
}
```

Validation error:

```
{
 "error": "Invalid request data"
}
```

---

# Login

Authenticate user and return JWT token.

### Endpoint

```
POST /auth/login
```

### Headers

```
Content-Type: application/json
```

### Request Body

```
{
 "email": "user@test.com",
 "password": "123456"
}
```

### Success Response

```
200 OK
```

```
{
 "message": "Login successful",
 "token": "JWT_TOKEN"
}
```

### Error Response

```
401 Unauthorized
```

```
{
 "error": "Invalid credentials"
}
```

---

# Login Rate Limiting

Login requests are limited using Redis.

### Policy

```
Max 5 login attempts per minute per IP
```

If limit exceeded:

```
429 Too Many Requests
```

```
{
 "error": "Too many login attempts. Try again later."
}
```

---

# Protected Endpoint

Example authenticated route.

### Endpoint

```
GET /auth/me
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Response

```
{
 "message": "Protected route accessed",
 "user": {
   "userId": 1,
   "email": "user@test.com"
 }
}
```

---

# JWT Authentication

JWT payload structure:

```
{
 userId: number
 email: string
}
```

JWT expiration:

```
1 hour
```

Example header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# Security Features

### Password Hashing

Passwords are hashed using **bcrypt** before storing.

Example:

```
$2b$10$aX9WuczBsFSakTm2yuG8/.iUGUIMalcdxrpu7FWxzwyrB0/Iz6y36
```

---

### Request Validation

Validation implemented using **Zod**.

| Field    | Rule                 |
| -------- | -------------------- |
| email    | valid email format   |
| password | minimum 6 characters |

---

### Redis Rate Limiting

Protects login endpoint against:

* brute force attacks
* credential stuffing
* bot traffic

---

# Docker

Build image:

```
docker build -t creatorpay-auth .
```

Run container:

```
docker run --network host --env-file .env creatorpay-auth
```

---

# Docker Compose

The CreatorPay backend stack runs using Docker Compose.

Services included:

```
Auth Service
PostgreSQL
Redis
```

Start stack:

```
docker compose up --build
```

---

# Role in CreatorPay Architecture

```
Client
   ↓
API Gateway
   ↓
Auth Service
   ↓
JWT Token
   ↓
Other Microservices
```

---

# Planned Improvements

Future features:

* Refresh tokens
* Email verification
* Password reset
* OAuth login (Google/GitHub)
* Centralized logging
* Auth audit events
