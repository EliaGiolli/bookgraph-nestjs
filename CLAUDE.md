# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

Migration/seed scripts run against **compiled output in `dist/`**, so `npm run build` runs first (already chained into the scripts above) — don't run `typeorm`/`migration:*` against `src/` directly.

## Architecture

### Module layout
Each domain is an isolated Nest module under `src/`: `auth`, `users`, `books`, `author`, `tags`, `book-connections`, `graph`, plus `common/` (guards, decorators, shared enums) and `config/` (env, Swagger, TypeORM data source). `src/app.module.ts` wires everything together and is the place to check when adding a new module or entity — every TypeORM entity must be listed both there (`TypeOrmModule.forRootAsync`) and in `src/config/data-source.ts` (used by the CLI-driven migration scripts).

### ESM / module resolution
`tsconfig.json` uses `"module": "nodenext"`. All relative imports must include the `.js` extension (e.g. `import { Book } from './entities/books.entity.js'`) even though the source files are `.ts` — this is required by nodenext ESM resolution, not a typo.

### Config & validation
- Environment variables are validated at bootstrap via a Zod schema (`src/lib/schemas/env.schema.ts`) passed to `ConfigModule.forRoot({ validate: ... })` in `app.module.ts`. Add new env vars there, not just to `.env.example`.
- `src/config/data-source.ts` reads `process.env` directly via `dotenv` (not `ConfigService`) because it's consumed by the TypeORM CLI outside the Nest app context — keep both in sync when adding DB-related env vars.
- Global `ValidationPipe` in `main.ts` has `whitelist: true` and `forbidNonWhitelisted: true` — DTOs must explicitly declare every accepted field or requests get rejected.

### Auth & authorization
- `AuthModule` is `@Global()` and exports `PassportModule`/`JwtModule`, so any feature module can use `JwtAuthGuard` (`src/common/guards/jwt-auth.guard.ts`) without importing `AuthModule` itself.
- `RolesGuard` + `@Roles(...)` (`src/common/decorators/role.decorator.ts`) check `UserRole` (`ADMIN`/`USER`) but are not wired as a global guard — apply `@UseGuards(JwtAuthGuard, RolesGuard)` explicitly where role checks are needed.
- Most write endpoints don't use role checks at all; instead they enforce **per-resource ownership** by filtering queries on `userId` (see `book-connections.service.ts`, `books.service.ts`) rather than relying on a general permission system. Follow this pattern for new resource endpoints: verify the record belongs to `request.user.id` before mutating it, don't assume a guard already did it.
- The only global guard registered in `app.module.ts` is `ThrottlerGuard` (rate limiting), not auth — each controller/route opts into `JwtAuthGuard` individually.

### Database
- TypeORM with `synchronize: false` everywhere — schema changes go through migrations in `src/migrations/`, generated from entity diffs via `npm run migration:generate`.
- SQL query logging is enabled (`logging: true` in `app.module.ts`).

### Known inconsistency: duplicate `BookConnection` entity
There are **two different entity classes** both mapped to the same table `book_connections`:
- `src/books/entities/book-connection.entity.ts` — no `userId` column, has `discoveryMethod`/`suggestedBy`/`createdAt`. This is the one registered in `app.module.ts`'s TypeORM entities array and in `data-source.ts`.
- `src/book-connections/entities/book-connection.entity.ts` — has `userId` and `description`, lacks the other columns. This is the one actually injected via `@InjectRepository(BookConnection)` in `book-connections.service.ts` (imported from `./entities/book-connection.entity.js`, i.e. the book-connections-local version).

When touching book connections, check which of the two files a given piece of code imports before assuming a column exists — they are not interchangeable, and only one of them matches the registered TypeORM metadata/migrations.

### Graph endpoint
`GraphService.getUserGraph` (`src/graph/graph.service.ts`) aggregates a user's `Book`s and `BookConnection`s into `{ nodes, edges }` for consumption by graph-visualization libraries (e.g. `vis-network`). Nodes are grouped by `book.status` (`BookRole`: `read`/`reading`/`wishlist`).
