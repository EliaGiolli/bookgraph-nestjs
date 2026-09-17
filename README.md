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
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
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
| 🔐 **JWT Authentication**     | Secure registration and login with Bearer JWT authentication   |
| 👤 **User Management**        | User CRUD operations and account management                    |
| 📚 **Book Management**        | Book catalogue with search, filtering, statuses, and metadata  |
| ✍️ **Author Management**      | Author catalogue and book relationships                        |
| 🏷️ **Tag Management**        | Custom book tags and categorization                            |
| 🔗 **Book Connections**       | Directional relationships between books                        |
| 🛡️ **Validation & Security** | DTO validation, ownership checks, and relationship constraints |
| 🕸️ **Graph Builder**         | Aggregates books and connections into `{ nodes, edges }`       |
| 📖 **OpenAPI Documentation**  | Fully documented API through Swagger UI                        |
| 🧪 **Testing Support**        | Unit, E2E, and coverage scripts                                |

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
│
├── auth/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── ...
│
├── users/
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── ...
│
├── books/
│   ├── dto/
│   ├── entities/
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── ...
│
├── author/
│   ├── dto/
│   ├── entities/
│   ├── author.controller.ts
│   ├── author.service.ts
│   └── ...
│
├── tags/
│   ├── dto/
│   ├── entities/
│   ├── tags.controller.ts
│   ├── tags.service.ts
│   └── ...
│
├── book-connections/
│   ├── dto/
│   ├── entities/
│   ├── book-connections.controller.ts
│   ├── book-connections.service.ts
│   └── ...
│
├── graph/
│   ├── dto/
│   ├── graph.controller.ts
│   ├── graph.service.ts
│   └── ...
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── pipes/
│   └── validators/
│
└── config/
    ├── database.config.ts
    └── ...
```

---

# 🚦 API Endpoints

## 🔐 Authentication

| Method | Endpoint         | Description                  | Auth |
| :----: | ---------------- | ---------------------------- | :--: |
| `POST` | `/auth/register` | Create a new account         |   ❌  |
| `POST` | `/auth/login`    | Authenticate and receive JWT |   ❌  |

---

## 👤 Users

|  Method  | Endpoint     | Description    | Auth |
| :------: | ------------ | -------------- | :--: |
|   `GET`  | `/users`     | Retrieve users |  🔐  |
|  `POST`  | `/users`     | Create a user  |  🔐  |
|  `PATCH` | `/users/:id` | Update a user  |  🔐  |
| `DELETE` | `/users/:id` | Delete a user  |  🔐  |

---

## 📖 Books

|  Method  | Endpoint       | Description              | Auth |
| :------: | -------------- | ------------------------ | :--: |
|   `GET`  | `/books`       | Search and filter books  |  🔐  |
|   `GET`  | `/books/:id`   | Retrieve a specific book |  🔐  |
|  `POST`  | `/books/books` | Register a new book      |  🔐  |
|  `PATCH` | `/books/:id`   | Update a book            |  🔐  |
| `DELETE` | `/books/:id`   | Delete a book            |  🔐  |

### 🔎 Book Filters

The book listing endpoint supports query-based filtering:

```text
GET /books?search=tolkien
GET /books?authorId=<uuid>
GET /books?tagId=<uuid>
GET /books?status=read
```

Supported filters:

* 🔎 `search`
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
|   `GET`  | `/author`     | List authors     |  🔐  |
|  `POST`  | `/author`     | Create an author |  🔐  |
|  `PATCH` | `/author/:id` | Update an author |  🔐  |
| `DELETE` | `/author/:id` | Delete an author |  🔐  |

---

## 🏷️ Tags

|  Method  | Endpoint    | Description  | Auth |
| :------: | ----------- | ------------ | :--: |
|   `GET`  | `/tags`     | List tags    |  🔐  |
|  `POST`  | `/tags`     | Create a tag |  🔐  |
|  `PATCH` | `/tags/:id` | Update a tag |  🔐  |
| `DELETE` | `/tags/:id` | Delete a tag |  🔐  |

---

## 🔗 Book Connections

BookGraph supports relationships between individual books.

A connection contains:

```json
{
  "sourceBookId": "source-uuid",
  "discoveredBookId": "target-uuid",
  "label": "Similar themes"
}
```

### Endpoints

|  Method  | Endpoint                | Description              |
| :------: | ----------------------- | ------------------------ |
|  `POST`  | `/book-connections`     | Create a book connection |
| `DELETE` | `/book-connections/:id` | Delete a connection      |

### Validation

The connection engine prevents:

* ❌ Self-referencing relationships
* ❌ Duplicate connections
* ❌ Connections involving books belonging to another user

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

The `/graph` endpoint aggregates a user's books and book connections into a structure designed for graph visualization.

```http
GET /graph
```

The endpoint returns:

```json
{
  "nodes": [
    {
      "id": "uuid",
      "label": "Book Title",
      "group": "READ"
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

The resulting structure can be consumed directly by frontend visualization libraries such as **vis-network**.

---

# 🔐 Security

Security is handled at both the authentication and resource-ownership levels.

### Authentication

Protected endpoints require a valid JWT:

```http
Authorization: Bearer <JWT>
```

### Authorization

Resource ownership checks ensure that users cannot manipulate books or relationships belonging to another account.

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

Custom validation rules are also used where domain-specific constraints are required.

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

* 🟢 **Node.js 18+**
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

Create a `.env` file in the project root:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=bookgraph_db

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=1d
```

> ⚠️ Never commit real credentials, JWT secrets, or production environment variables to version control.

---

## 4. Start the Development Server

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

The project includes scripts for unit testing, E2E testing, and test coverage.

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

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
* [ ] 🧪 Expand unit test coverage
* [ ] 🧪 Expand integration tests
* [ ] 🧪 Expand E2E test coverage

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
