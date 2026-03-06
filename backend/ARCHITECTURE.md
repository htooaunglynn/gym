# Backend Architecture Guide

This document outlines the Domain-Driven Design (DDD) architecture implemented in the backend application, focusing on high performance, reusability, security, and strict separation of concerns.

## Core Architectural Principles

1.  **Strict Separation of Concerns (API vs. Business Logic)**
    - **Controllers (API Layer):** Strictly handle HTTP requests, routing, and input validation mapping. They act as thin proxies that pass validated DTOs to services.
    - **Services (Business Logic Layer):** Contain all core application logic. They process data, interact with the database (via Prisma), and return standardized responses. They do not know about HTTP contexts.

2.  **Domain-Driven Modules**
    - Features are grouped into self-contained "modules" (e.g., `users`, `auth`).
    - Each module is an independent vertical slice containing its dedicated controller, service, interfaces, and specific DTOs.
    - This promotes high cohesion and loose coupling, making future microservice extraction or lazy loading easier.

3.  **Centralized Core Infrastructure**
    - Application-wide configurations, security mechanisms, and request formatting layers are isolated in a central `core` directory.
    - This prevents feature modules from being cluttered with global mechanics.

4.  **Reusable Shared Components**
    - Code shared heavily across multiple domains resides in the `shared` directory.
    - This guarantees write-once, use-anywhere utility structures like base DTOs for pagination.

## Directory Structure Overview

```text
src/
├── app.controller.ts     # Root / Healthcheck API routes
├── app.module.ts         # Main entry point wiring all feature and core modules
├── main.ts               # Bootstrapping, global middleware (Helmet, CORS, Pipes)
├── core/                 # Centralized security & formatting layers
│   ├── filters/          # Global Exception Filters (maps errors to standard JSON)
│   ├── guards/           # Global Security Guards (e.g., API Keys, JWT verification)
│   ├── interceptors/     # Global Interceptors (e.g., standardized response wrappers)
│   └── logger/           # Pino application logging setup
├── modules/              # Vertical Feature Slices (Domain boundaries)
│   ├── auth/             # Authentication domain (Login, Register, Strategies)
│   └── users/            # User management domain (CRUD operations)
├── prisma/               # Database Integration
│   └── prisma.service.ts # Prisma ORM client and database interaction methods
└── shared/               # Reusable Application Elements
    └── dto/              # Common Data Transfer Objects (e.g., CursorPaginationDto)
```

## Security Implementation

Security is layered and centralized:

- **Global Level (`main.ts`):** `helmet` (HTTP header security), `compression` (payload reduction), and `cors` are applied application-wide.
- **Module Level (`app.module.ts`):** NestJS Throttler is globally scoped to prevent rate-limit abuse.
- **Guard Level (`core/guards`):** API Key validation, JWT strategy extraction, and declarative Role-Guard execution protect endpoints before they hit controllers.

## Data Transfer Objects (DTOs) and Validation

- All incoming data is validated strictly through classes decorated with `class-validator` rules.
- The global `ValidationPipe` drops any undeclared properties (`whitelist: true`, `forbidNonWhitelisted: true`), preventing mass-assignment attacks.
- Feature-specific DTOs live inside their respective `modules/<feature>/dto/` folders, while cross-domain DTOs live in `shared/dto/`.
