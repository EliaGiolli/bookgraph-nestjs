# 📚 BookGraph Backend API

<p align="center">
  <strong>A modular NestJS REST API powering a personal library and interactive book-network platform.</strong>
</p>

<p align="center">
  <a href="https://nestjs.com/">
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://typeorm.io/">
    <img src="https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM"/>
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </a>
  <a href="https://swagger.io/">
    <img src="https://img.shields.io/badge/OpenAPI-85EA2D?style=for-the-badge&logo=openapiinitiative&logoColor=black" alt="OpenAPI"/>
  </a>
  <a href="https://jwt.io/">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/API-REST-02569B?style=flat-square" alt="REST API"/>
  <img src="https://img.shields.io/badge/Documentation-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger"/>
</p>

---

## 🌟 Overview

**BookGraph** is a personal library management and book-network visualization platform.

This repository contains the **NestJS backend API**, providing the domain logic, authentication, persistence, filtering, relationships, and graph aggregation required by the BookGraph ecosystem.

The API is designed around a **modular architecture** with clear separation of responsibilities and is built using:

* 🟢 **NestJS** — backend framework
* 📘 **TypeScript** — strongly typed application development
* 🗄️ **PostgreSQL** — relational persistence
* 🔗 **TypeORM** — object-relational mapping
* 🔐 **JWT / Passport** — authentication
* 🛡️ **class-validator** — DTO validation
* 📖 **OpenAPI / Swagger** — interactive API documentation

The backend exposes a dedicated graph endpoint capable of transforming books and their relationships into a **node-edge structure suitable for visualization libraries such as `vis-network`**.

---

## ✨ Key Features

| Feature                       | Description                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| 🔐 **JWT Authentication**     | Registration and login; JWT via HttpOnly cookie or Bearer header |
| 👤 **User Management**        | Self-service account management, admin-only user listing       |
| 📚 **Book Management**        | Book catalogue with search, filtering, statuses, and metadata  |
| ✍️ **Author Management**      | Author catalogue and book relationships                        |
| 🏷️ **Tag Management**        | Custom book tags and categorization                            |
| 🔗 **Book Connections**       | Directional relationships between books                        |
| 🛡️ **Validation & Security** | DTO validation, ownership checks, roles, and rate limiting     |
| 🕸️ **Graph Builder**         | Aggregates books and connections into `{ nodes, edges }`       |
| 📖 **OpenAPI Documentation**  | Fully documented API through Swagger UI                        |
| 🧪 **Testing Support**        | Vitest unit suite plus a Supertest E2E suite against Postgres  |

---

## 🏗️ Architecture

The backend follows a modular NestJS architecture where each domain is isolated into its own module.

```text
                         ┌─────────────────────┐
                         │   Angular Frontend  │
                         │      (Planned)      │
                         └──────────┬──────────┘
                                    │
                              REST / HTTP
                                    │
                         ┌──────────▼──────────┐
                         │    BookGraph API    │
                         │       NestJS        │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
        ┌────▼─────┐          ┌─────▼─────┐          ┌────▼─────┐
        │   Auth   │          │   Users   │          │  Books   │
        └──────────┘          └───────────┘          └────┬─────┘
                                                         │
                              ┌──────────────────────────┼───────────┐
                              │                          │           │
                         ┌────▼────┐              ┌──────▼─────┐ ┌───▼────┐
                         │ Authors │              │    Tags    │ │ Graph  │
                         └─────────┘              └────────────┘ └───┬────┘
                                                                     │
                                                            ┌────────▼────────┐
                                                            │ Book Connections │
                                                            └────────┬────────┘
                                                                     │
                                                              ┌──────▼──────┐
                                                              │ PostgreSQL  │
                                                              └─────────────┘
```

---

## 🛠️ Tech Stack

### Backend

<p>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

### Database & Persistence

<p>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeORM-FE0902?style=flat-square&logo=typeorm&logoColor=white" alt="TypeORM"/>
</p>

### Authentication & Validation

<p>
  <img src="https://img.shields.io/badge/Passport-34E27A?style=flat-square&logo=passport&logoColor=black" alt="Passport"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/bcrypt-338?style=flat-square" alt="bcrypt"/>
</p>

* 🔐 Passport JWT
* 🔑 JSON Web Tokens
* 🔒 bcrypt password hashing
* ✅ `class-validator`
* 🔄 `class-transformer`

### API Documentation

<p>
  <img src="https://img.shields.io/badge/OpenAPI-85EA2D?style=flat-square&logo=openapiinitiative&logoColor=black" alt="OpenAPI"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger"/>
</p>

The API uses `@nestjs/swagger` to automatically expose an interactive **OpenAPI 3.0** specification.

---

## 📁 Repository Structure

```text
src/
├── auth/                 # register/login, JwtStrategy, JWT module config
│   ├── dto/
│   └── strategies/
├── users/                # accounts (self or ADMIN), bcrypt hashing
├── books/                # user-owned books, filters, book↔tag join entity
├── author/               # shared author catalogue
├── tags/                 # user-owned tags
├── book-connections/     # directed, user-owned links between two books
├── graph/                # { nodes, edges } aggregation for vis-network
├── common/
│   ├── decorators/       # @Roles()
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   ├── types/            # AuthenticatedRequest, BookRole / UserRole enums
│   ├── utils/            # requireUserId, duration parsing
│   └── validators/       # @IsDifferentFrom()
├── config/
│   ├── data-source.ts    # TypeORM DataSource used by the migration CLI
│   └── swagger.config.ts
├── lib/
│   ├── database/seeds/   # seed script
│   └── schemas/          # Zod env schema, validated at bootstrap
├── migrations/
├── app.module.ts
├── app.setup.ts          # global pipes and middleware, shared by main.ts and E2E
└── main.ts
test/
└── app.e2e-spec.ts
```

---

# 🚦 API Endpoints

## 🔐 Authentication

| Method | Endpoint         | Description                                                 | Auth |
| :----: | ---------------- | ----------------------------------------------------------- | :--: |
| `POST` | `/auth/register` | Create a new account                                        |   ❌  |
| `POST` | `/auth/login`    | Authenticate; sets the JWT in an HttpOnly `access_token` cookie |   ❌  |

Both routes are limited to 5 requests per 6 seconds. Every other route shares a global limit of 10 requests per 6 seconds.

---

## 👤 Users

|  Method  | Endpoint     | Description     |       Auth       |
| :------: | ------------ | --------------- | :--------------: |
|   `GET`  | `/users`     | List all users  |     🔐 ADMIN     |
|  `POST`  | `/users`     | Create a user   |     🔐 ADMIN     |
|   `GET`  | `/users/:id` | Retrieve a user | 🔐 self / ADMIN  |
|  `PATCH` | `/users/:id` | Update a user   | 🔐 self / ADMIN  |
| `DELETE` | `/users/:id` | Delete a user   | 🔐 self / ADMIN  |

Users sign themselves up through `/auth/register`. `POST /users` is for administrators only. A non-admin who addresses another user's `:id` gets `403 Forbidden`. Passwords can only be set at registration, never through these routes.

---

## 📖 Books

|  Method  | Endpoint       | Description              | Auth |
| :------: | -------------- | ------------------------ | :--: |
|   `GET`  | `/books`       | Search and filter books  |  🔐  |
|   `GET`  | `/books/:id`   | Retrieve a specific book |  🔐  |
|  `POST`  | `/books`       | Register a new book      |  🔐  |
|  `PATCH` | `/books/:id`   | Update a book            |  🔐  |
| `DELETE` | `/books/:id`   | Delete a book            |  🔐  |

Books belong to the user who created them. Every route sees only the caller's books, and another user's book id returns `404 Not Found`.

### 🔎 Book Filters

The book listing endpoint supports query-based filtering:

```text
GET /books?search=tolkien
GET /books?authorId=<uuid>
GET /books?tagId=<uuid>
GET /books?status=read
```

Supported filters:

* 🔎 `search` (case-insensitive match on book title or author name)
* ✍️ `authorId`
* 🏷️ `tagId`
* 📚 `status`

Supported reading statuses:

```text
read
reading
wishlist
```

---

## ✍️ Authors

|  Method  | Endpoint      | Description      | Auth |
| :------: | ------------- | ---------------- | :--: |
|   `GET`  | `/author`     | List authors       |  🔐  |
|   `GET`  | `/author/:id` | Retrieve an author |  🔐  |
|  `POST`  | `/author`     | Create an author   |  🔐  |
|  `PATCH` | `/author/:id` | Update an author   |  🔐  |
| `DELETE` | `/author/:id` | Delete an author   |  🔐  |

Authors are a shared catalogue that no single user owns. An author who still has books cannot be deleted (`409 Conflict`).

---

## 🏷️ Tags

|  Method  | Endpoint    | Description  | Auth |
| :------: | ----------- | ------------ | :--: |
|   `GET`  | `/tags`     | List tags      |  🔐  |
|   `GET`  | `/tags/:id` | Retrieve a tag |  🔐  |
|  `POST`  | `/tags`     | Create a tag   |  🔐  |
|  `PATCH` | `/tags/:id` | Update a tag   |  🔐  |
| `DELETE` | `/tags/:id` | Delete a tag   |  🔐  |

Tags belong to the user who created them. Tag names are unique per user, so two users can each have a tag with the same name.

---

## 🔗 Book Connections

BookGraph supports relationships between individual books.

A connection contains:

```json
{
  "sourceBookId": "source-uuid",
  "discoveredBookId": "target-uuid",
  "description": "Similar themes"
}
```

### Endpoints

|  Method  | Endpoint                | Description              | Auth |
| :------: | ----------------------- | ------------------------ | :--: |
|  `POST`  | `/book-connections`     | Create a book connection |  🔐  |
| `DELETE` | `/book-connections/:id` | Delete a connection      |  🔐  |

### Validation

The connection engine prevents:

* ❌ Self-referencing relationships (`400 Bad Request`)
* ❌ Duplicate connections, in either direction (`409 Conflict`)
* ❌ Connections involving books belonging to another user (`404 Not Found`)

Example:

```text
Book A ───────────────► Book B
       "Similar themes"

       ✓ Valid
```

Whereas:

```text
Book A ───────────────► Book A

       ✗ Invalid
       Self-reference
```

---

# 🕸️ Graph API

The `/graph` endpoint aggregates the authenticated user's books and book connections into a structure designed for graph visualization.

```http
GET /graph  🔐
```

The endpoint returns:

```json
{
  "nodes": [
    {
      "id": "uuid",
      "label": "Book Title",
      "group": "read"
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "from": "source-uuid",
      "to": "target-uuid",
      "label": "Relation"
    }
  ]
}
```

### Graph Model

```text
                    ┌──────────────┐
                    │    Book A    │
                    │    READ      │
                    └──────┬───────┘
                           │
                    "Related to"
                           │
                           ▼
                    ┌──────────────┐
                    │    Book B    │
                    │   READING    │
                    └──────┬───────┘
                           │
                       "Inspired"
                           │
                           ▼
                    ┌──────────────┐
                    │    Book C    │
                    │  WISHLIST    │
                    └──────────────┘
```

Nodes are grouped by book status (`read`, `reading`, `wishlist`). An edge's `label` is the connection's `description`, and is left out when the connection has none.

The resulting structure can be consumed directly by frontend visualization libraries such as **vis-network**.

---

# 🔐 Security

Security is handled at both the authentication and resource-ownership levels.

### Authentication

Protected endpoints require a valid JWT. `POST /auth/login` sets it in an HttpOnly `access_token` cookie, marked `Secure` when `NODE_ENV=production`, which browsers send automatically. API clients can send the same token in a header instead:

```http
Authorization: Bearer <JWT>
```

`JWT_EXPIRATION` sets the token lifetime, and the cookie expires at the same time.

### Authorization

Ownership checks stop users from reading or changing books, tags, connections, or accounts that belong to someone else. Each service enforces ownership by filtering on the caller's user id; no global guard does it. Role checks (`ADMIN` / `USER`) apply only to the admin routes under `/users`.

The Book Connections module specifically validates ownership of both:

```text
sourceBookId
      +
discoveredBookId
```

before creating a relationship.

### Input Validation

Incoming DTOs are validated using:

```text
class-validator
        +
class-transformer
```

The global `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`, so a request carrying any field its DTO does not declare is rejected with `400 Bad Request`. Custom validators such as `@IsDifferentFrom()` cover domain-specific rules.

---

# 📖 Swagger / OpenAPI

BookGraph includes a fully documented **OpenAPI 3.0** specification.

Once the application is running, open:

```text
http://localhost:3000/api
```

Swagger UI provides:

* 📚 Complete endpoint documentation
* 🧩 Request schemas
* 📦 Response schemas
* 📝 DTO descriptions
* 💡 Example payloads
* 🔐 Bearer authentication
* 🧪 Interactive endpoint testing

### Raw OpenAPI Specification

The generated JSON specification is available at:

```text
http://localhost:3000/api-json
```

This can be used with API clients, documentation generators, or client-code generation tools.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* 🟢 **Node.js 20+**
* 📦 **npm** or **Yarn**
* 🐘 **PostgreSQL**

---

## 1. Clone the Repository

```bash
git clone https://github.com/EliaGiolli/bookgraph-nestjs.git

cd bookgraph-nestjs
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env` in the project root and fill it in:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION=1d
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_NAME=bookgraph
```

A Zod schema (`src/lib/schemas/env.schema.ts`) validates these at startup, and the app refuses to boot if any value is invalid:

| Variable         | Required | Default       | Notes                                                                 |
| ---------------- | :------: | ------------- | --------------------------------------------------------------------- |
| `NODE_ENV`       |          | `development` | `development`, `production` or `test`. SQL logging is on only in `development` |
| `PORT`           |          | `3000`        |                                                                       |
| `JWT_SECRET`     |    ✅    |               | At least 32 characters                                                |
| `JWT_EXPIRATION` |          | `1d`          | A duration such as `60s`, `15m`, `2h` or `1d`                         |
| `DB_HOST`        |          | `localhost`   |                                                                       |
| `DB_PORT`        |          | `5432`        |                                                                       |
| `DB_USERNAME`    |    ✅    |               |                                                                       |
| `DB_PASSWORD`    |    ✅    |               |                                                                       |
| `DB_NAME`        |    ✅    |               |                                                                       |

> ⚠️ Never commit real credentials, JWT secrets, or production environment variables to version control.

---

## 4. Set Up the Database

Create the database named in `DB_NAME`, then apply the migrations. TypeORM `synchronize` is off, so migrations are the only way the schema changes.

```bash
npm run migration:run   # builds, then applies pending migrations
npm run seed            # optional: builds, then loads sample data
```

To change the schema, edit the entities and run `npm run migration:generate` to generate a migration from the diff.

---

## 5. Start the Development Server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api
```

---

# 🧪 Testing

Tests run on **Vitest** (not Jest), with `@nestjs/testing` for module setup.

### Unit Tests

```bash
npm run test
```

Unit tests mock every repository and need no database.

### End-to-End Tests

```bash
npm run test:e2e
```

The E2E suite (`test/app.e2e-spec.ts`) boots the full `AppModule` and uses Supertest to walk the main journey: register, log in, create an author and two books, connect them, and read the graph. It also checks that a second user cannot see or touch the first user's data.

It needs the PostgreSQL database from your `.env`, with migrations applied. Every row it creates is tied to a username unique to that run and is deleted when the suite finishes.

### Test Coverage

```bash
npm run test:cov
```

---

# 🔄 Development Workflow

A typical development workflow looks like:

```text
                 ┌──────────────┐
                 │  Feature /   │
                 │    Fix       │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │   NestJS      │
                │    Module     │
                └───────┬───────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       ┌────────────┐      ┌────────────┐
       │    DTO     │      │  Service   │
       │ Validation │      │  Domain    │
       └─────┬──────┘      └─────┬──────┘
             │                   │
             └─────────┬─────────┘
                       ▼
                 ┌───────────┐
                 │ Controller│
                 └─────┬─────┘
                       │
                       ▼
                ┌──────────────┐
                │ REST / Swagger│
                └──────────────┘
```

---

# 🗺️ Project Roadmap

### Backend

* [x] 🔐 Authentication
* [x] 👤 User management
* [x] 📚 Book management
* [x] ✍️ Author management
* [x] 🏷️ Tag management
* [x] 🔗 Book connections
* [x] 🕸️ Graph aggregation
* [x] 📖 OpenAPI / Swagger documentation
* [x] 🧪 Unit tests for every module
* [x] 🧪 E2E smoke test of the main user journey
* [ ] 🧪 Dedicated test database for the E2E suite

### Frontend

* [ ] 🅰️ Angular application
* [ ] 🔐 Authentication UI
* [ ] 📚 Book management interface
* [ ] 🔎 Search and filtering
* [ ] 🔗 Book relationship management
* [ ] 🕸️ Interactive graph visualization
* [ ] 📊 Dashboard
* [ ] 📱 Responsive UI

---

# 🧩 BookGraph Ecosystem

The long-term architecture is intended to combine a reactive Angular frontend with the NestJS API:

```text
┌─────────────────────────────────────────────────────────┐
│                    BOOKGRAPH PLATFORM                   │
├───────────────────────────┬─────────────────────────────┤
│                           │                             │
│     🅰️ Angular Frontend  │     🟢 NestJS Backend      │
│                           │                             │
│  ┌─────────────────────┐  │  ┌──────────────────────┐  │
│  │      Dashboard     │  │  │         Auth         │  │
│  ├─────────────────────┤  │  ├──────────────────────┤  │
│  │   Book Management   │◄─┼─►│        Books         │  │
│  ├─────────────────────┤  │  ├──────────────────────┤  │
│  │   Search & Filters  │  │  │       Authors        │  │
│  ├─────────────────────┤  │  ├──────────────────────┤  │
│  │   Graph Visualizer  │  │  │        Tags          │  │
│  └─────────────────────┘  │  ├──────────────────────┤  │
│                           │  │  Connections / Graph  │  │
│                           │  └──────────┬───────────┘  │
│                           │             │              │
└───────────────────────────┴─────────────┼──────────────┘
                                          │
                                  ┌───────▼───────┐
                                  │  PostgreSQL   │
                                  └───────────────┘
```

---

# 📌 API Design Principles

BookGraph follows several core backend principles:

* 🧩 **Modularity** — each domain is isolated into a dedicated NestJS module.
* 🔒 **Security by ownership** — authenticated users can only operate on resources they are authorized to access.
* ✅ **Explicit validation** — DTOs validate incoming data before it reaches the domain layer.
* 📘 **Strong typing** — TypeScript and DTOs provide compile-time and runtime safety.
* 🔌 **RESTful communication** — resources are exposed through predictable HTTP endpoints.
* 📖 **Self-documentation** — Swagger keeps the API contract visible and testable.
* ⚡ **Separation of concerns** — controllers, services, DTOs, entities, and infrastructure have distinct responsibilities.

---

# 📜 License

This project is licensed under the **MIT License**.

---

<p align="center">

### 📚 BookGraph Backend

**NestJS · TypeScript · PostgreSQL · TypeORM · JWT · OpenAPI**

Built as the backend foundation for an interactive personal book graph.

</p>
