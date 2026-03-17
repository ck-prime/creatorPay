# 🚀 CreatorPay Load Testing (k6)

This directory contains **load testing scripts** for the CreatorPay backend.

We use **k6** to simulate high traffic scenarios and validate system performance under load.

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

## 1️⃣ Signup Load Test

**File:** `signup-test.js`

### Purpose

Simulates large-scale user registration.

### Configuration

* 1000 virtual users (VUs)
* 10 iterations each
* Total = **10,000 users**

### Features

* Generates **unique emails**
* Prevents duplicate user errors
* Tests database write performance

### Run

```bash
k6 run load-tests/signup-test.js
```

# 📊 Load Test Results

## 🧪 Signup Load Test (10,000 Users)

**Script:** `signup-test.js`
**Scenario:** 1000 Virtual Users × 10 iterations each
**Total Target Requests:** 10,000

---

## 📈 Execution Summary

```
Total Requests Executed: 6,484
Dropped Iterations:      3,516
Test Duration:           ~2 minutes
```

---

## ✅ Success Rate

```
Checks Passed:  6,477
Checks Failed:  7
Success Rate:   99.89%
```

✔ System handled majority of requests successfully
⚠️ Minor failures due to timeouts under heavy load

---

## ⏱️ Latency Metrics

| Metric                | Value          |
| --------------------- | -------------- |
| Average Response Time | ~19.95 seconds |
| Median (p50)          | ~20.44 seconds |
| p90                   | ~24.38 seconds |
| p95                   | ~24.46 seconds |
| Max                   | ~60 seconds    |

---

---

## 2️⃣ Auth Flow Test

**File:** `auth-load-test.js`

### Flow

```text
Login → Protected Route → Refresh → Logout
```

### Purpose

* Tests full authentication lifecycle
* Validates token handling
* Measures end-to-end latency

### Run

```bash
k6 run load-tests/auth-load-test.js
```

---

# 📊 Metrics to Watch

After running tests, focus on:

| Metric            | Meaning           |
| ----------------- | ----------------- |
| http_req_duration | Request latency   |
| http_req_failed   | Failure rate      |
| checks_succeeded  | Test success rate |
| vus               | Active users      |

---

# ⚠️ Notes

* Ensure **Auth Service is running** on `http://localhost:4001`
* Ensure PostgreSQL and Redis are running
* Signup test creates real users → database will grow

---

# 🧠 Best Practices

* Run tests on **clean database**
* Avoid duplicate emails (handled in script)
* Monitor CPU and memory during tests
* Start with smaller loads before scaling

---

# 🔥 Future Tests (Planned)

* Login spike test
* Rate limit testing (brute force simulation)
* Kafka-based like system (100k likes/min)
* Distributed system performance testing

---

# 🎯 Goal

These tests demonstrate:

* High-concurrency backend handling
* Microservice readiness
* Real-world system behavior under load

---

# 👨‍💻 Author

CreatorPay Backend System
Distributed Microservices Architecture Project
