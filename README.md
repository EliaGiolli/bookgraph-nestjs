# BookGraph

> **A private archive for the way you discover knowledge.**

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-e6a23c?style=for-the-badge" alt="Status: in development" />
  <img src="https://img.shields.io/badge/backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/runtime-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
</p>

BookGraph is a full-stack web application for managing the books you have read and the books you want to read. Its defining feature is a visual graph that captures **how each book entered your intellectual journey**: through a bibliography, a recommendation from someone you know, an internet search, or another book already in your archive.

BookGraph is not just a book catalog. It is a way to preserve the path behind your ideas.

## ✨ Why BookGraph?

The discovery of a book is often fragmented across a physical book, an AI assistant, an online bookstore, bookmarks, and personal notes. BookGraph brings that moment of discovery and its context into one private archive.

| Typical reading trackers | BookGraph |
| --- | --- |
| Focus on what you decided to read | Focuses on **where the decision came from** |
| Store books as isolated entries | Connects books through their discovery paths |
| Encourage community and social activity | Protects a personal, private knowledge archive |

## 🧭 Core concepts

- **Reading catalog** - Keep track of books you have read and books on your wishlist.
- **Discovery trails** - Record the source that led you to each book: bibliography, word of mouth, web research, and more.
- **Knowledge graph** - Explore the relationships between books through a visual network inspired by tools such as Obsidian.
- **Personal by design** - No community feed, no social pressure, no purchasing flow. Just your intellectual archive.
- **AI-assisted discovery** - Future integrations will use AI suggestions to help expand your graph without losing the context behind each recommendation.

## 🚀 Project status

BookGraph is currently in active development. The NestJS API foundation is available today, with the graph experience, user accounts, persistent storage, and AI discovery planned as the project evolves.

### Available API endpoints

The current API exposes:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/book` | Return the available books |
| `GET` | `/book/:id` | Return a book by numeric ID |
| `POST` | `/book` | Add a book to the current in-memory collection |

Interactive API documentation is available at `http://localhost:3000/api` while the server is running.

## 🛠️ Technology stack

- **Backend:** NestJS, TypeScript, Node.js
- **Validation:** `class-validator`, `class-transformer`
- **API documentation:** Swagger / OpenAPI
- **Planned persistence:** PostgreSQL with TypeORM
- **Planned authentication:** JWT
- **Planned local infrastructure:** Docker
- **Testing:** Vitest and Supertest

## 📦 Getting started

### Prerequisites

- Node.js 20 or newer
- npm, Bun, or another compatible package manager

### Installation

```bash
git clone https://github.com/EliaGiolli/bookgraph-nestjs.git
cd bookgraph-nest
npm install
```

### Run the API

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API starts on `http://localhost:3000` by default.

## 🧪 Testing and quality

```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Lint
npm run lint
```

## 🗺️ Roadmap

- [x] Initial NestJS API structure
- [x] Basic book listing, lookup, and creation endpoints
- [x] Swagger / OpenAPI endpoint
- [ ] PostgreSQL persistence with TypeORM
- [ ] User authentication and private libraries with JWT
- [ ] Read / wishlist status and discovery metadata
- [ ] Book-to-book discovery connections
- [ ] Interactive graph visualization
- [ ] AI-powered book discovery suggestions

## 📁 Project structure

```text
src/
├── books/            # Book module, controller, service, and DTOs
├── auth/             # Authentication module (in progress)
├── admin/            # Administrative features (in progress)
├── book-connections/ # Book relationship graph (in progress)
├── common/           # Shared application concerns
├── config/           # Application configuration
└── content/          # Current book data source
```

## 🔐 Product philosophy

> **"A place you go when you want to archive your knowledge."**

BookGraph is intentionally personal and private. It does not try to turn reading into a social competition or a shopping journey. It exists to make the evolution of your thinking visible: what you read, what you want to read, and the connections that brought you there.

## 📄 License

This project is currently private and under active development. Licensing details will be added when the project is ready for public release.
