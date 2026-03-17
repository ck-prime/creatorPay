# 🚀 CreatorPay — Distributed Creator Economy Platform

A **production-grade distributed system** simulating a modern creator economy platform.

CreatorPay models real-world systems used by platforms like monetization apps, live-streaming services, and creator tools — focusing on **scalability, reliability, and performance under load**.

---

# 🌍 Overview

CreatorPay enables users to:

* 👍 Like posts at massive scale (**100k+ likes/min simulation**)
* 💸 Tip creators and manage balances
* 🔐 Authenticate securely (JWT + Redis + rate limiting)
* 📬 Handle async workflows (email, notifications)
* ⚡ Process high-throughput events using Kafka
* 💰 Manage wallets using **double-entry accounting**

---

# 🧠 System Design Goals

* Horizontal scalability
* Fault tolerance
* Event-driven architecture
* High concurrency handling
* Idempotent operations
* Low-latency responses under load

---

# 🏗 Architecture

```text
Client
   ↓
API Gateway (Nginx)
   ↓
-------------------------------------------------------
| Auth | User | Content | Like | Payment | Wallet |
-------------------------------------------------------
                           ↓
                         Kafka
                           ↓
-------------------------------------------------------
| Ledger | Notification | Analytics | Fraud Detection |
-------------------------------------------------------
```

---

# ⚙️ Core Concepts

### 🔹 Microservices

Each service is independently deployable and scalable.

### 🔹 Event-Driven Architecture

Services communicate using **Kafka events**.

### 🔹 Async Processing

Heavy tasks handled via:

* queues
* workers
* background jobs

### 🔹 Distributed Systems

* Redis caching
* distributed locks
* idempotency handling

---

# 🧩 Tech Stack

## Backend

* Node.js
* PostgreSQL
* Redis
* Kafka
* Docker

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* React Query

## Mobile

* React Native
* Expo

## Infrastructure

* Docker Compose
* Nginx (API Gateway)
* Prometheus + Grafana (planned)
* ELK Stack (planned)

---

# 🐳 Setup Guide

## 📌 System Requirements

```text
Ubuntu 22.04+
Node.js 20+
Docker 29+
8GB RAM recommended
```

---

## 🔧 Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 📦 Install pnpm

```bash
sudo npm install -g pnpm
```

---

## 🐳 Install Docker

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

## ✅ Verify Docker

```bash
docker --version
docker compose version
```

---

## 🔓 Run Docker without sudo

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

# ⚡ Kafka Setup

```bash
mkdir kafka && cd kafka
```

### docker-compose.yml

```yaml
version: '3'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

---

## ▶️ Start Kafka

```bash
docker compose up -d
```

---

## 📊 Verify

```bash
docker ps
```

---

# 🚀 Running the Project

## Start full system

```bash
docker compose down --remove-orphans
docker compose up --build
```

---

## Stop system

```bash
docker compose down
```

---

## View logs

```bash
docker logs -f <container_name>
```

---

# 📈 What’s Implemented (Current State)

## ✅ Authentication Service (Completed)

* Signup / Login
* JWT access + refresh tokens
* Redis-based rate limiting
* Password hashing (bcrypt)
* Password reset (secure token hashing)
* Async email queue (worker-based)
* Load tested (~650 req/sec)

---

## 🔥 Load Testing Results

* ~650 requests/sec handled
* ~170ms avg latency
* ~592ms p95 latency
* Bottleneck: bcrypt (CPU bound)

---

# 🗺 Development Roadmap

## ~~Phase 1 — Planning~~

~~System design, schemas, Kafka topics~~

## ~~Phase 2 — Infrastructure~~

~~Docker, Redis, PostgreSQL, Kafka~~

## ~~Phase 3 — Auth Service~~ ✅ COMPLETED

* Signup/Login
* JWT + Refresh tokens
* Rate limiting
* Password reset (email queue)

---

## 🚧 Phase 4 — User & Content

* User profiles
* Creator posts
* Media uploads

---

## 🚧 Phase 5 — Like System (High Scale)

* Redis counters
* Kafka events
* async workers

---

## 🚧 Phase 6 — Wallet & Ledger

* Wallet service
* double-entry accounting

---

## 🚧 Phase 7 — Payments

* Stripe + Razorpay
* webhooks
* idempotency

---

## 🚧 Phase 8 — Concurrency

* distributed locks
* race condition handling

---

## 🚧 Phase 9 — Frontend

* Next.js app
* real-time UI

---

## 🚧 Phase 10 — Mobile

* React Native app

---

## 🚧 Phase 11 — Load Testing

* 100k+ events simulation

---

## 🚧 Phase 12 — Production

* CI/CD
* monitoring
* cloud deployment

---

# 🧠 System Design Highlights

* Stateless authentication
* Redis-backed scaling
* Event-driven microservices
* Async job processing
* High concurrency handling
* Production-like architecture

---

# 🎯 Goal of This Project

To demonstrate:

```text
Real-world backend engineering skills
+
Distributed systems design
+
High-scale architecture thinking
```

---

# 📄 License

MIT License

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
