# 🚀 CreatorPay Load Testing (k6)

This directory contains **load testing scripts** for the CreatorPay backend.

We use **k6** to simulate realistic traffic patterns and evaluate system performance under load.

---

# 📦 Setup

## Install k6

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install k6
```

### Mac

```bash
brew install k6
```

### Verify installation

```bash
k6 version
```

---

# 🧪 Running Tests

Run any test using:

```bash
k6 run load-tests/<file-name>.js
```

Example:

```bash
k6 run load-tests/signup-test.js
```

---

# 📁 Available Test Scripts

---

## 1️⃣ Signup Load Test

**File:** `signup-test.js`

### 🎯 Purpose

Simulates large-scale user registration to test:

* Database write performance
* API stability under load

---

### ⚙️ Configuration

* Gradual ramp-up load (staged traffic)
* Dynamic user generation
* Controlled request pacing

---

### ✨ Features

* Generates **unique emails**
* Handles duplicate user scenarios gracefully
* Tracks:

  * Success rate
  * Latency (avg, p95)
  * Custom metrics

---

### ▶️ Run

```bash
k6 run load-tests/signup-test.js
```

---

## 2️⃣ Auth Flow Load Test

**File:** `auth-load-test.js`

---

### 🔄 Flow

```text
Login → Protected Route → Refresh Token → Logout
```

---

### 🎯 Purpose

Tests the **complete authentication lifecycle**:

* Login performance
* JWT validation (protected routes)
* Refresh token flow (Redis)
* Logout handling

---

### ⚙️ Configuration

* Gradual ramp-up (realistic traffic simulation)
* Multiple concurrent users
* Reusable test users (10k pool)

---

### ✨ Features

* Custom metrics:

  * Login duration
  * Success rate
* Threshold validation:

  * p95 latency
  * failure rate
* Debug logging for failed requests

---

### ▶️ Run

```bash
k6 run load-tests/auth-load-test.js
```

---

# 📊 Test Reports & Insights

Each test generates:

## ✅ Console Summary

Includes:

* Total requests
* Success rate
* Average latency
* p95 latency (critical metric)

---

## ✅ JSON Report

Generated automatically:

```
auth-summary.json
signup-summary.json
```

---

### 📌 Key Metrics to Watch

| Metric            | Meaning                         |
| ----------------- | ------------------------------- |
| http_req_duration | Request latency                 |
| p(95)             | 95% requests below this latency |
| http_req_failed   | Failure rate                    |
| checks            | Functional correctness          |
| vus               | Concurrent users                |

---

# 🧠 How to Evaluate Results

## ✅ Healthy System

* p95 latency < **300–500ms**
* success rate > **95%**
* minimal timeouts

---

## ❌ Problem Indicators

* High latency (>1s)
* Increasing error rate
* Dropped iterations
* Timeouts under load

---

# ⚠️ Prerequisites

Before running tests, ensure:

* Auth Service running at:

  ```
  http://localhost:4001
  ```
* PostgreSQL is running
* Redis is running

---

# 🧪 Testing Strategy

Avoid jumping directly to high load.

Use gradual scaling:

```text
100 → 300 → 500 → 1000 users
```

---

# 🧠 Best Practices

* Use a **clean database** before signup tests
* Monitor:

  * CPU usage
  * Memory usage
* Keep bcrypt cost low during load testing
* Ensure Redis is properly connected

---

# 🔥 Future Enhancements

* Spike testing (sudden traffic bursts)
* Rate-limit attack simulation
* Distributed load testing (multi-node k6)
* Kafka-based async processing tests
* 100k requests/min architecture validation

---

# 🎯 Goal

These tests validate:

* Backend scalability under concurrency
* Authentication system performance
* Microservice readiness for real-world traffic

---

# 👨‍💻 Project

**CreatorPay**
Distributed Microservices Backend System
