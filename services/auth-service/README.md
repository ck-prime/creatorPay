# 🚀 CreatorPay — Auth Service

The **Auth Service** handles authentication, authorization, and account security for the CreatorPay platform.

It is designed as a **scalable microservice** with support for:

* JWT authentication
* Redis caching & rate limiting
* Queue-based email processing
* Secure password reset flows
* Load-tested performance

---

# 🧩 Service Overview

| Property          | Value                  |
| ----------------- | ---------------------- |
| Service Name      | auth-service           |
| Port              | 4001                   |
| Database          | PostgreSQL             |
| Cache             | Redis                  |
| Authentication    | JWT (Access + Refresh) |
| Password Security | bcrypt                 |
| Async Processing  | Queue + Worker         |

---

# 🏗 Architecture

```text
Client
   ↓
API Gateway
   ↓
Auth Service
   ↓
-----------------------------------
| Rate Limit (Redis)              |
| Validation (Zod)                |
| Controllers                    |
| Service Layer                  |
| Repository Layer               |
-----------------------------------
   ↓
PostgreSQL

Async Flow:
Auth Service → Queue → Worker → Email Service
```

---

# 📁 Project Structure

```text
auth-service
│
├── src
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
│   │   ├── user.repository.js
│   │   └ passwordReset.repository.js
│
│   ├── routes
│   │   └ auth.routes.js
│
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └ rateLimit.middleware.js
│
│   ├── queues
│   │   └ email.queue.js
│
│   ├── workers
│   │   └ email.worker.js
│
│   ├── utils
│   │   ├── token.util.js
│   │   └ logger.js
│
│   └ server.js
│
├── load-tests
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

# ⚙️ Environment Variables

```env
PORT=4001
JWT_SECRET=supersecretkey
FRONTEND_URL=http://localhost:3000

DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=creatorpay_auth

REDIS_HOST=redis
REDIS_PORT=6379
```

---

# 🗄 Database

### Users Table

```sql
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 email VARCHAR(255) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

### Password Reset Table

```sql
CREATE TABLE password_resets (
 id SERIAL PRIMARY KEY,
 user_id INT NOT NULL,
 token_hash TEXT NOT NULL,
 expires_at TIMESTAMP NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# ⚡ Redis Usage

Redis is used for:

* Login rate limiting
* Refresh token storage
* User caching
* Password reset rate limiting

---

# 🔐 Authentication Flow

```text
Login →
  Verify password (bcrypt) →
  Generate access token (JWT) →
  Generate refresh token →
  Store refresh token in Redis
```

---

# 🔁 Refresh Token Flow

```text
Client sends refresh token →
Redis lookup →
New access token issued
```

---

# 📬 Password Reset Flow

```text
Forgot Password →
Generate token →
Store hashed token in DB →
Push email job to queue →
Worker sends email →
User resets password
```

---

# 📡 API Documentation

---

## 🩺 Health Check

```
GET /health
```

---

## 📝 Signup

```
POST /auth/signup
```

---

## 🔑 Login

```
POST /auth/login
```

### Response

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

## 🔄 Refresh Token

```
POST /auth/refresh
```

---

## 🚪 Logout

```
POST /auth/logout
```

---

## 🔒 Protected Route

```
GET /auth/me
```

---

## 📧 Forgot Password

```
POST /auth/forgot-password
```

---

## 🔁 Reset Password

```
POST /auth/reset-password
```

---

# 🛡 Security Features

### ✅ Password Hashing

* bcrypt with salt rounds

### ✅ JWT Authentication

* Access Token: 15 minutes
* Refresh Token: 7 days (Redis)

### ✅ Rate Limiting

* Login: 5 attempts/min per IP
* Password reset cooldown

### ✅ Token Security

* Reset tokens stored as **hash**
* Prevents token leakage

### ✅ Silent Failures

* Prevents user enumeration

---

# 📬 Email System

* Queue-based (async)
* Worker processes jobs
* Retry mechanism (3 attempts)
* Decoupled architecture

---

# 🐳 Docker

### Build

```bash
docker build -t creatorpay-auth .
```

### Run

```bash
docker run --network host --env-file .env creatorpay-auth
```

---

# 🐳 Docker Compose

```bash
docker compose up --build
```

Services:

* Auth Service
* PostgreSQL
* Redis

---

# 🧪 Load Testing

Using **k6**

### Signup Test

```bash
k6 run load-tests/signup-test.js
```

### Auth Flow Test

```bash
k6 run load-tests/auth-load-test.js
```

### Current Performance

* ✅ ~650 req/sec throughput
* ✅ <200ms avg latency (signup)
* ⚠️ Login CPU-bound (bcrypt)

---

# 🧠 System Design Highlights

* Microservice architecture
* Redis-backed scaling
* Async job processing
* Stateless authentication
* Load tested under high concurrency

---

# 🔮 Planned Improvements

* Worker-thread bcrypt (CPU optimization)
* Dedicated Email Microservice
* Kafka event-driven architecture
* OAuth (Google/GitHub)
* Email verification
* Distributed logging (ELK)

---

# 🎯 Role in CreatorPay

```text
Client → API Gateway → Auth Service → JWT → Other Services
```

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
