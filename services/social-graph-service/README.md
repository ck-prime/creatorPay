# 👥 Social Graph Service — CreatorPay

A **high-performance social graph microservice** responsible for managing user relationships in CreatorPay.

This service handles:

```text
Follow / Unfollow
Followers / Following
Mutual connections
Follow suggestions
```

Built with **scalability, performance, and microservice isolation** in mind.

---

# 🧠 Responsibilities

The Social Graph Service is responsible for:

* Managing **user relationships**
* Providing **followers & following lists**
* Generating **mutual connections**
* Powering **follow suggestions**
* Enriching responses via **user-service**
* Optimizing reads using **Redis caching**

---

# 🏗 Architecture

```text
Client
   ↓
API Gateway
   ↓
Social Graph Service
   ↓
-------------------------
| PostgreSQL (Graph DB) |
-------------------------
        ↓
     Redis Cache
        ↓
User Service (via HTTP)
```

---

# ⚙️ Core Features

## 🔹 Follow / Unfollow

* Transaction-safe operations
* Prevents:

  * duplicate follows
  * self-follow
* Updates follower/following counts atomically

---

## 🔹 Followers & Following APIs

* Paginated responses
* Enriched with user profile data
* Optimized with caching

---

## 🔹 Mutual Followers

* Finds common followers between users
* Uses efficient SQL joins

---

## 🔹 Follow Suggestions

* Graph-based recommendations
* “Users followed by people you follow”
* Ranked by frequency

---

## 🔹 Redis Caching (Critical Optimization)

* Cache-aside pattern
* Bulk fetch with `mget`
* Pipeline writes
* Reduces DB + network load

---

# 🧩 Tech Stack

* Node.js
* Express
* PostgreSQL
* Redis (ioredis)
* Axios (service-to-service calls)

---

# 🗄 Database Design

## 📌 `follows`

```text
id
follower_id
following_id
created_at
```

### Constraints:

* Unique (follower_id, following_id)
* Prevent self-follow
* Indexed for fast reads

---

## 📌 `user_stats`

```text
user_id
followers_count
following_count
updated_at
```

### Purpose:

* O(1) count reads
* Avoid expensive COUNT queries

---

# 🔌 API Endpoints

## 🔹 Follow a User

```http
POST /social/follow/:userId
```

---

## 🔹 Unfollow a User

```http
DELETE /social/unfollow/:userId
```

---

## 🔹 Get Followers

```http
GET /social/followers/:userId?page=1&limit=10
```

---

## 🔹 Get Following

```http
GET /social/following/:userId?page=1&limit=10
```

---

## 🔹 Get Stats

```http
GET /social/stats/:userId
```

---

## 🔹 Mutual Followers

```http
GET /social/mutual/:userId1/:userId2
```

---

## 🔹 Follow Suggestions

```http
GET /social/suggestions
```

---

# 🔐 Authentication

* All requests go through API Gateway
* User identity passed via:

```text
x-user-id (header)
```

---

# 🔁 Service Communication

This service communicates with:

## 👤 User Service

Used for:

* Fetching user profile data
* Bulk user enrichment

```text
POST /user/bulk
GET /user/:id
```

---

# ⚡ Performance Optimizations

## ✅ Caching

* Redis cache for user profiles
* TTL-based invalidation
* Bulk reads with `mget`

---

## ✅ Database Optimization

* Indexed queries
* No cross-service joins
* Denormalized counts (`user_stats`)

---

## ✅ Batch Processing

* Bulk user fetch instead of N+1 queries

---

# 🚀 Running the Service

```bash
cd services/social-graph-service
npm install
npm run dev
```

---

## Setup Database

```bash
npm run setup
npm run migrate
```

---

# 🧪 Example Request

```bash
curl http://localhost:3000/social/follow/2 \
  -H "Authorization: Bearer <TOKEN>"
```

---

# 🧠 Design Principles

```text
Single Responsibility
+
Service Isolation
+
High Read Performance
+
Scalable Graph Queries
```

---

# 📈 Scaling Strategy

This service is designed to scale with:

* Read-heavy workloads
* Large follower graphs
* High concurrency

Future improvements:

* Kafka event integration
* Graph partitioning
* Redis clustering

---

# 🚧 Future Enhancements

* Event-driven updates (Kafka)
* Real-time notifications
* Blocking / privacy controls
* Graph ranking improvements

---

# 🎯 Role in System

```text
Auth Service   → Identity
User Service   → Profile Data
Graph Service  → Relationships
Feed Service   → (next) Content delivery
```

---

# 📄 License

MIT License

---

# 👨‍💻 CreatorPay

Distributed Microservices Backend System
