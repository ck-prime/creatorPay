# 🚀 CreatorPay — Distributed Creator Economy Platform

A **production-grade distributed backend system** simulating a modern creator economy platform.

CreatorPay focuses on **real-world backend engineering**, including microservices, API gateways, distributed data management, caching, and scalable system design.

---

# 🌍 Overview

CreatorPay enables:

* 🔐 Secure authentication (JWT + Redis)
* 👤 User profile management
* 👥 Social graph (follow/unfollow system)
* 📬 Async workflows (email via queue + worker)
* 🚦 API Gateway routing & validation
* ⚡ High-performance backend architecture
* 🧠 Real-world microservices evolution

---

# 🧠 System Design Goals

* Horizontal scalability
* Fault tolerance
* Service isolation (true microservices)
* Clean API routing (Gateway)
* Async processing
* Low-latency reads via caching
* Production-like architecture

---

# 🏗 Current Architecture (Phase 6)

```text
Client
   ↓
API Gateway (Node.js)
   ↓
-------------------------------------------------
| Auth | User | Social Graph | (Post - upcoming) |
-------------------------------------------------
   ↓        ↓         ↓
Redis   PostgreSQL   PostgreSQL
           ↓              ↓
        User Data     Follow Graph
                         ↓
                      Redis Cache
```

---

# ⚙️ Core Concepts Implemented

### 🔹 API Gateway

* Central entry point
* Request routing (multi-service)
* JWT validation
* Rate limiting
* Header-based identity injection (`x-user-id`)

---

### 🔹 Authentication System

* JWT access + refresh tokens
* Secure password hashing (bcrypt)
* Refresh token rotation
* Redis session storage

---

### 🔹 User Service

* User profile creation
* Username generation
* Profile retrieval
* Bulk user fetch (for service-to-service communication)

---

### 🔹 Social Graph Service

* Follow / Unfollow system
* Followers / Following APIs (paginated)
* Mutual followers
* Follow suggestions (graph-based)

---

### 🔹 Caching Layer (Redis)

* User profile caching (social graph enrichment)
* Bulk cache reads using `mget`
* Pipeline writes for performance
* Cache-aside pattern

---

### 🔹 Async Processing

* Email queue using BullMQ
* Background worker processing

---

# 🧩 Tech Stack

## Backend

* Node.js
* Express
* PostgreSQL
* Redis (ioredis)
* BullMQ

---

## Architecture

* Microservices (service isolation)
* API Gateway pattern
* Service-to-service communication (HTTP)
* Cache-aside pattern

---

## Infrastructure (Current)

* Docker (planned usage)
* API Gateway (Node.js)

---

## Planned

* Kafka (event-driven system)
* Feed service (fanout system)
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

## Start User Service

```bash
cd services/user-service
npm install
npm run dev
```

---

## Start Social Graph Service

```bash
cd services/social-graph-service
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

---

## ✅ Phase 2 — Infrastructure

✔ PostgreSQL
✔ Redis

---

## ✅ Phase 3 — Auth Service

✔ Signup / Login
✔ JWT + Refresh tokens
✔ Rate limiting
✔ Password reset
✔ Email queue + worker

---

## ✅ Phase 4 — API Gateway

✔ Request proxying
✔ JWT validation
✔ Rate limiting
✔ Secure header injection

---

## ✅ Phase 5 — User Service

✔ User profile system
✔ Username generation
✔ Bulk user APIs

---

## ✅ Phase 6 — Social Graph Service

✔ Follow / Unfollow
✔ Followers / Following APIs
✔ Pagination
✔ Mutual followers
✔ Follow suggestions
✔ Redis caching (optimized)
✔ Service-to-service enrichment

---

# 🔥 Load Testing (Auth Service)

* ~650 requests/sec handled
* ~170ms avg latency
* Bottleneck: bcrypt (CPU-bound)

---

# 🗺 Updated Roadmap

## ✅ Phase 1 — Planning

~~System design~~

---

## ✅ Phase 2 — Infrastructure

~~Redis + PostgreSQL~~

---

## ✅ Phase 3 — Auth Service

~~Auth + Email Queue~~

---

## ✅ Phase 4 — API Gateway

~~Routing + JWT + Rate limiting~~

---

## ✅ Phase 5 — User Service

~~User profiles~~

---

## ✅ Phase 6 — Social Graph

~~Follow system + suggestions~~

---

## 🚧 Phase 7 — Feed System (NEXT BIG STEP)

* Feed service (new microservice)
* Fanout-on-write model
* Timeline generation
* Redis feed caching

---

## 🚧 Phase 8 — Content Service

* Posts & media
* storage strategy

---

## 🚧 Phase 9 — Like System (High Scale)

* Redis counters
* Kafka events
* async workers

---

## 🚧 Phase 10 — Wallet & Ledger

* double-entry accounting
* transaction safety

---

## 🚧 Phase 11 — Payments

* Stripe / Razorpay
* webhook handling

---

## 🚧 Phase 12 — Event-Driven Architecture

* Kafka integration
* decoupled services

---

# 🧠 System Design Highlights

* Stateless authentication
* Redis-backed caching layer
* API Gateway pattern
* Microservice separation (auth, user, graph)
* Service-to-service communication
* Optimized read-heavy systems
* Cache-aside strategy

---

# 🎯 Goal of This Project

To demonstrate:

```text
Real-world backend engineering
+
Microservices architecture
+
Scalable system design
+
Production-level thinking
```

---

# 📄 License

MIT License

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
