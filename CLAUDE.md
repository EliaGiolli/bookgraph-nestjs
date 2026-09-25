# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Before doing anything always check
1. NestJS skills (`.agents/skills/nestjs-best-practices/`)
2. Typescript skills (`.agents/skills/typescript-expert/`)

## Commands

```bash
npm run start:dev        # dev server with watch (http://localhost:3000, Swagger at /api)
npm run build             # nest build
npm run lint               # oxlint src/ test/

npm run test               # unit tests (vitest run, matches **/*.spec.ts)
npm run test:watch         # vitest watch mode
npm run test:cov           # vitest run --coverage
npm run test:e2e           # vitest run --config ./vitest.config.e2e.ts (matches **/*.e2e-spec.ts)

# single test file
npx vitest run src/books/books.service.spec.ts

npm run migration:generate # builds, then generates a migration into src/migrations from entity diffs
npm run migration:run      # builds, then applies pending migrations
npm run migration:revert   # builds, then reverts the last migration
npm run seed                # builds, then runs dist/lib/database/seeds/seed.js
```

Tests use **Vitest**, not Jest, despite this being a Nest project — `@nestjs/testing`'s `Test.createTestingModule` is used as usual, just run through vitest.

Unit tests mock every repository and need no database. The e2e suite (`test/app.e2e-spec.ts`) boots the real `AppModule` against the Postgres configured in `.env` (migrations must be applied), creates rows under run-unique usernames and deletes them in `afterAll`.

Migration/seed scripts run against **compiled output in `dist/`**, so `npm run build` runs first (already chained into the scripts above) — don't run `typeorm`/`migration:*` against `src/` directly.

## Architecture

### Module layout
Each domain is an isolated Nest module under `src/`: `auth`, `users`, `books`, `author`, `tags`, `book-connections`, `graph`, plus `common/` (guards, decorators, shared types/enums, utils, validators), `config/` (Swagger, TypeORM data source) and `lib/` (Zod env schema, seed). `src/app.module.ts` wires everything together and is the place to check when adding a new module or entity — every TypeORM entity must be listed both there (`TypeOrmModule.forRootAsync`) and in `src/config/data-source.ts` (used by the CLI-driven migration scripts).

### ESM / module resolution
`tsconfig.json` uses `"module": "nodenext"`. All relative imports must include the `.js` extension (e.g. `import { Book } from './entities/books.entity.js'`) even though the source files are `.ts` — this is required by nodenext ESM resolution, not a typo.

### Config & validation
- Environment variables are validated at bootstrap via a Zod schema (`src/lib/schemas/env.schema.ts`) passed to `ConfigModule.forRoot({ validate: ... })` in `app.module.ts`. Add new env vars there, not just to `.env.example`.
- `src/config/data-source.ts` reads `process.env` directly via `dotenv` (not `ConfigService`) because it's consumed by the TypeORM CLI outside the Nest app context — keep both in sync when adding DB-related env vars.
- Global middleware and pipes live in `configureApp()` (`src/app.setup.ts`), shared by `main.ts` and the e2e suite — add new global setup there, not in `main.ts`, so tests keep matching production. The global `ValidationPipe` has `whitelist: true` and `forbidNonWhitelisted: true` — DTOs must explicitly declare every accepted field or requests get rejected.

### Auth & authorization
- `AuthModule` is `@Global()` and exports `PassportModule`/`JwtModule`, so any feature module can use `JwtAuthGuard` (`src/common/guards/jwt-auth.guard.ts`) without importing `AuthModule` itself.
- `POST /auth/login` returns the JWT only as an HttpOnly `access_token` cookie; `JwtStrategy` accepts either that cookie or an `Authorization: Bearer` header.
- `RolesGuard` + `@Roles(...)` (`src/common/decorators/role.decorator.ts`) check `UserRole` (`ADMIN`/`USER`) but are not wired as a global guard — apply `@UseGuards(JwtAuthGuard, RolesGuard)` explicitly where role checks are needed (currently only `GET`/`POST /users`).
- Most endpoints don't use role checks at all; instead they enforce **per-resource ownership** by filtering queries on `userId` (see `book-connections.service.ts`, `books.service.ts`, `tags.service.ts`) rather than relying on a general permission system. Follow this pattern for new resource endpoints: verify the record belongs to the caller (`requireUserId(req)`) before reading or mutating it, don't assume a guard already did it. `Author` is the exception: a shared catalogue with no owner.
- The only global guard registered in `app.module.ts` is `ThrottlerGuard` (rate limiting), not auth — each controller/route opts into `JwtAuthGuard` individually.

### Database
- TypeORM with `synchronize: false` everywhere — schema changes go through migrations in `src/migrations/`, generated from entity diffs via `npm run migration:generate`.
- SQL query logging is on only when `NODE_ENV=development` (vitest sets `NODE_ENV=test`, so test runs stay quiet).
- `BookConnection` lives in `src/book-connections/entities/book-connection.entity.ts` (owned via `userId`, optional `description`). Books cascade-delete with their user, and connections cascade-delete with either of their books.

### Graph endpoint
`GraphService.getUserGraph` (`src/graph/graph.service.ts`) aggregates a user's `Book`s and `BookConnection`s into `{ nodes, edges }` for consumption by graph-visualization libraries (e.g. `vis-network`). Nodes are grouped by `book.status` (`BookRole`: `read`/`reading`/`wishlist`).
