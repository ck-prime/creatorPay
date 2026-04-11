# 🚀 CreatorPay — Distributed Creator Economy Platform

A **production-grade distributed backend system** simulating a modern creator economy platform.

CreatorPay focuses on **real-world backend engineering**, including authentication, API gateways, async processing, and scalable system design.

---

# 🌍 Overview

CreatorPay enables:

* 🔐 Secure authentication (JWT + Redis)
* 📬 Async workflows (email via queue + worker)
* 🚦 API Gateway routing & validation
* ⚡ High-performance backend architecture
* 🧠 Real-world microservices evolution

---

# 🧠 System Design Goals

* Horizontal scalability
* Fault tolerance
* Service isolation
* Clean API routing (Gateway)
* Async processing
* Production-like architecture

---

# 🏗 Current Architecture (Phase 4)

```text
Client
   ↓
API Gateway (Node.js)
   ↓
---------------------
|   Auth Service    |
---------------------
       ↓
   Redis + PostgreSQL
       ↓
 Email Queue + Worker
```

---

# ⚙️ Core Concepts Implemented

### 🔹 API Gateway

* Central entry point
* Request routing
* JWT validation
* Rate limiting

### 🔹 Authentication System

* JWT access + refresh tokens
* Secure password hashing (bcrypt)
* Refresh token rotation
* Redis session storage

### 🔹 Async Processing

* Email queue using BullMQ
* Background worker processing

### 🔹 Caching

* Redis used for:

  * login optimization
  * rate limiting
  * token storage

---

# 🧩 Tech Stack

## Backend

* Node.js
* Express
* PostgreSQL
* Redis
* BullMQ (queue system)

## Infrastructure (Current)

* Docker (planned usage)
* API Gateway (Node.js)

## Planned

* Kafka
* Nginx
* Monitoring stack

---

# 🚀 Running the Project

## Start Auth Service

```bash
cd services/auth-service
npm install
npm run dev
```

---

## Start Gateway

```bash
cd gateway
npm install
npm run dev
```

---

## Start Worker (IMPORTANT)

```bash
node src/workers/email.worker.js
```

---

# 📈 Current Implementation Status

## ✅ Phase 1 — Planning

✔ System design
✔ Architecture defined

## ✅ Phase 2 — Infrastructure

✔ PostgreSQL
✔ Redis

## ✅ Phase 3 — Auth Service

✔ Signup / Login
✔ JWT + Refresh tokens
✔ Rate limiting
✔ Password reset
✔ Email queue + worker

## ✅ Phase 4 — API Gateway

✔ Request proxying
✔ Path handling (fixed)
✔ JWT validation
✔ Rate limiting

---

# 🔥 Load Testing (Auth Service)

* ~650 requests/sec handled
* ~170ms avg latency
* Bottleneck: bcrypt (CPU-bound)

---

# 🗺 Updated Roadmap

## ✅ Phase 1 — Planning

~~System design~~

## ✅ Phase 2 — Infrastructure

~~Redis + PostgreSQL~~

## ✅ Phase 3 — Auth Service

~~Auth + Email Queue~~

## ✅ Phase 4 — API Gateway

~~Routing + JWT + Rate limiting~~

---

## 🚧 Phase 5 — User Service (NEXT)

* User profile system
* DB schema design
* Gateway integration

---

## 🚧 Phase 6 — Content Service

* Posts & media
* storage strategy

---

## 🚧 Phase 7 — Like System (High Scale)

* Redis counters
* Kafka events
* async workers

---

## 🚧 Phase 8 — Wallet & Ledger

* double-entry accounting
* transaction safety

---

## 🚧 Phase 9 — Payments

* Stripe / Razorpay
* webhook handling

---

## 🚧 Phase 10 — Event-Driven Architecture

* Kafka integration
* decoupled services

---

# 🧠 System Design Highlights

* Stateless authentication
* Redis-backed scaling
* API Gateway pattern
* Async job processing
* Microservice-ready architecture

---

# 🎯 Goal of This Project

To demonstrate:

```text
Real-world backend engineering
+
Microservices architecture
+
Scalable system design
```

---

# 📄 License

MIT License

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
