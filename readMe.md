# CreatorPay --- Distributed Creator Economy Platform

A **production-grade distributed system** simulating a real creator
economy platform where users can like posts, tip creators, subscribe,
and manage wallets.

The system is designed to demonstrate **high-scale backend
architecture** including microservices, event-driven systems,
distributed transactions, and payment integrations.

------------------------------------------------------------------------

# Overview

CreatorPay simulates the architecture of modern platforms such as
creator monetization systems and live-streaming platforms.

Key features include:

-   High throughput like system (100k+ likes per minute)
-   Wallet infrastructure with double-entry accounting
-   Stripe & Razorpay payment integration
-   Event-driven microservices architecture using Kafka
-   Redis caching and distributed locks
-   Docker-based infrastructure
-   Real-time notifications
-   Distributed transaction handling
-   Race condition prevention
-   Idempotent payment APIs

------------------------------------------------------------------------

# Architecture

The platform uses a **microservices architecture** connected through
Kafka events.

                    ┌──────────────┐
                    │  API Gateway │
                    └──────┬───────┘
                           │
     ┌──────────┬──────────┬──────────┬──────────┬──────────┐
     │          │          │          │          │          │
    Auth      User      Content     Like      Payment     Wallet
    Service   Service    Service    Service    Service    Service
                                                   │
                                                   │
                                                 Kafka
                                                   │
                            ┌───────────────┬───────────────┬───────────────┐
                            │               │               │               │
                      Ledger Service   Notification   Analytics        Fraud
                                         Service       Service       Detection

------------------------------------------------------------------------

# Tech Stack

## Backend

-   Node.js / NestJS
-   PostgreSQL
-   Redis
-   Kafka
-   Docker
-   Nginx API Gateway

## Frontend (Web)

-   Next.js
-   React
-   TypeScript
-   TailwindCSS
-   React Query / TanStack Query
-   WebSockets

## Mobile

-   React Native
-   Expo

## Infrastructure

-   Docker
-   Docker Compose
-   Prometheus
-   Grafana
-   ELK Stack

------------------------------------------------------------------------

# Setup

### System Requirements

    Ubuntu 22.04+
    Node.js 20+
    Docker 29+
    8GB RAM recommended

------------------------------------------------------------------------

# Install Node.js

    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs

Verify installation

    node -v
    npm -v

------------------------------------------------------------------------

# Install pnpm

    sudo npm install -g pnpm

Verify

    pnpm -v

------------------------------------------------------------------------

# Install Docker

    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

Verify

    docker --version

Allow docker without sudo

    sudo usermod -aG docker $USER
    newgrp docker

Test docker

    docker run hello-world

------------------------------------------------------------------------

# Kafka Setup

Create directory

    mkdir kafka
    cd kafka

Create `docker-compose.yml`

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

Start Kafka

    docker compose up -d

Verify

    docker ps

------------------------------------------------------------------------

# Usage

### Start Infrastructure

    cd kafka
    docker compose up -d

### Stop Infrastructure

    docker compose down

### Restart Infrastructure

    docker compose down
    docker compose up -d

### View Running Containers

    docker ps

### View Logs

Kafka logs

    docker logs kafka-kafka-1

Live logs

    docker logs -f kafka-kafka-1

Zookeeper logs

    docker logs kafka-zookeeper-1

------------------------------------------------------------------------

# Restarting After Machine Shutdown

    sudo systemctl start docker
    cd ~/kafka
    docker compose up -d
    docker ps

------------------------------------------------------------------------

# Development Roadmap

## ~~Phase 1 --- Planning~~

~~Define services\
Design database schemas\
Design Kafka topics\
Setup repository structure~~

------------------------------------------------------------------------

## ~~Phase 2 --- Infrastructure Setup~~

~~Setup Docker\
Setup PostgreSQL\
Setup Redis\
Setup Kafka\
Configure API Gateway~~

------------------------------------------------------------------------

## Phase 3 --- Authentication Service

-   Signup
-   Login
-   JWT tokens
-   refresh tokens
-   rate limiting

------------------------------------------------------------------------

## Phase 4 --- User and Content Services

-   User profiles
-   Creator posts
-   Media uploads
-   Post feeds

------------------------------------------------------------------------

## Phase 5 --- High Scale Like System

-   Redis based like counters
-   Kafka events
-   background workers

------------------------------------------------------------------------

## Phase 6 --- Wallet & Ledger

-   Wallet service
-   double entry accounting
-   transaction tracking

------------------------------------------------------------------------

## Phase 7 --- Payment Integration

-   Stripe integration
-   Razorpay integration
-   webhook handling
-   idempotency

------------------------------------------------------------------------

## Phase 8 --- Concurrency Handling

-   distributed locks
-   race condition testing

------------------------------------------------------------------------

## Phase 9 --- Frontend

-   Next.js web app
-   React Query integration
-   real-time WebSockets

------------------------------------------------------------------------

## Phase 10 --- Mobile App

-   React Native application
-   push notifications

------------------------------------------------------------------------

## Phase 11 --- Load Testing

-   simulate high traffic
-   performance optimization

------------------------------------------------------------------------

## Phase 12 --- Production Deployment

-   cloud deployment
-   monitoring setup
-   CI/CD pipeline

------------------------------------------------------------------------

# License

MIT License

# start project
```
docker compose down --remove-orphans
docker compose up --build
```