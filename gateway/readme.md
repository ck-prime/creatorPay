# 🚀 CreatorPay API Gateway

The **API Gateway** is the central entry point for all client requests in CreatorPay.

It handles **routing, authentication, rate limiting, and request validation** before forwarding traffic to backend services.

---

# 🌍 Architecture

```text
Client
   ↓
API Gateway (Node.js)
   ↓
---------------------
|   Auth Service    |
---------------------
```

---

# ⚙️ Responsibilities

## 🔹 1. Request Routing

Routes incoming requests to the correct service.

```text
/auth/* → Auth Service
```

---

## 🔹 2. JWT Authentication

* Validates access tokens for protected routes
* Blocks unauthorized requests at gateway level

### 🔓 Public Routes

```text
/auth/login
/auth/signup
/auth/forgot-password
/auth/reset-password
/auth/refresh
```

---

### 🔒 Protected Routes

All other routes require:

```http
Authorization: Bearer <access_token>
```

Example:

```text
/auth/me
/auth/logout
```

---

## 🔹 3. Rate Limiting

* 100 requests per minute per IP
* Prevents abuse and brute-force attacks

---

## 🔹 4. Logging

Uses Morgan to log all incoming requests.

---

## 🔹 5. Proxy Layer

Uses `http-proxy-middleware` to forward requests.

### ⚠️ Important Behavior

Express strips route prefixes, so we restore them:

```js
pathRewrite: (path) => "/auth" + path
```

---

# 🧩 Tech Stack

* Node.js
* Express
* http-proxy-middleware
* JSON Web Token (JWT)
* express-rate-limit
* Morgan

---

# 📁 Project Structure

```text
gateway/
 ├── src/
 │    ├── server.js
 │    ├── routes/
 │    │     └── auth.routes.js
 │    ├── middleware/
 │    │     ├── auth.middleware.js
 │    │     └── rateLimit.middleware.js
 │    └── config/
 │          └── services.js
 ├── package.json
 └── .env
```

---

# 🔐 Environment Variables

Create a `.env` file:

```env
PORT=3000
JWT_SECRET=supersecretkey
```

👉 Must match Auth Service JWT_SECRET

---

# 🚀 Running the Gateway

## Install dependencies

```bash
npm install
```

---

## Development mode

```bash
npm run dev
```

---

## Production mode

```bash
npm start
```

---

# 🔁 Request Flow

## Login Flow

```text
POST /auth/login
   ↓
Gateway (no auth required)
   ↓
Auth Service
   ↓
Returns access + refresh tokens
```

---

## Protected Route Flow

```text
GET /auth/me
   ↓
Gateway (JWT validation)
   ↓
Auth Service
```

---

## Refresh Token Flow

```text
POST /auth/refresh
   ↓
Gateway (public route)
   ↓
Auth Service
   ↓
Returns new access + refresh token
```

---

## Logout Flow

```text
POST /auth/logout
   ↓
Gateway (requires access token)
   ↓
Auth Service
   ↓
Deletes refresh token from Redis
```

---

# ⚠️ Important Notes

## 🔸 Token Rotation

* Refresh tokens are rotated
* Old tokens are deleted after use

```text
Old token → invalid ❌
New token → valid ✅
```

---

## 🔸 Security Design

* Access token → authentication
* Refresh token → session renewal
* Logout requires authentication

---

# 🧠 Key Concepts

## API Gateway Pattern

Single entry point for all services.

## Separation of Concerns

```text
Middleware → Auth, Rate limit
Routes → Proxy logic
Config → Service URLs
```

## Stateless Authentication

JWT-based system with Redis-backed sessions.

---

# 🛠 Future Improvements

* Role-Based Access Control (RBAC)
* Multiple service routing (/user, /payments)
* Circuit breaker
* Load balancing
* API versioning
* Request validation layer

---

# 🎯 Purpose

This gateway demonstrates:

```text
Production-ready API Gateway
+
JWT-based authentication layer
+
Scalable microservices routing
```

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
