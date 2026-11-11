# FabricIO Backend

REST API for the [FabricIO](../README.md) web gaming platform, built with **Spring Boot** as a **modular monolith**. Each feature lives in its own module with a lightweight DDD structure (`web`, `application`, `domain`).

---

## Tech Stack

| Area | Technologies |
| :--- | :----------- |
| Language / build | Java 21 (Java 17 also works), Gradle (wrapper) |
| Framework | Spring Boot, Spring Security |
| Authentication | JWT with role-based authorization |
| Database | PostgreSQL |
| Object storage | MinIO (local/dev), Cloudflare R2 (production), via the S3 API |
| API docs | Swagger / OpenAPI |
| Testing | JUnit, Mockito, module boundary test (`ModularityTests`) |
| Packaging | Docker (`Dockerfile`), deployed on Render |

---

## Architecture

The backend is organized **by feature, not by technical layer**. Every module encapsulates its own business logic and domain model, and must not depend on another module's internals.

### Modules

| Module | Responsibility | Status |
| :----- | :------------- | :----- |
| `auth` | Authentication, JWT, sessions, `UserPrincipal` | Implemented |
| `users` | Accounts, roles and permissions | Implemented |
| `games` | Games, tags and media | Implemented |
| `games` (favorites, ratings) | Previously the `interactions` module, now merged into `games` | Planned |
| `purchases` | Orders and transactions | Planned (to be redesigned) |

### Layers inside a module

| Layer | Contents |
| :---- | :------- |
| `web` | Thin controllers: HTTP mapping, request validation, response wrapping. No business logic. |
| `application` | Service interfaces and implementations, handlers, DTOs and mappers. Orchestrates use cases. |
| `domain` | Rich domain entities, domain exceptions and repository abstractions. |

Request flow:

```text
HTTP request → web (controller) → application (IService → Service) → domain (entity, repository) → PostgreSQL
                      ▲                       │
                      └──── DTO + Mapper ◄────┘
```

---

## Project Structure

```text
src/main/java/fabricio/backend/
├── modules/
│   ├── auth/
│   │   ├── web/               # Controllers
│   │   ├── application/       # IService, Service, handlers, DTOs, mappers
│   │   └── domain/            # Entities, exceptions, repository abstractions
│   ├── games/                 # Same layout as auth
│   └── users/                 # Same layout as auth
│
├── shared/                    # Cross-cutting components used by all modules
│   ├── base/                  # Base classes
│   │   ├── BaseEntity.java    #   id, createdAt, updatedAt
│   │   └── ApiResponse.java   #   Standard response wrapper
│   ├── configs/               # System configuration (Security, OpenAPI/Swagger)
│   ├── exceptions/            # GlobalExceptionHandler and custom exceptions
│   ├── enums/                 # Shared enums and constants (UserRole, MediaType, ...)
│   └── storage/               # Object storage interface with MinIO / S3 (R2) implementations
│
└── BackendApplication.java    # Spring Boot entry point
```

---

## Development Conventions

Follow these rules when adding or changing features.

1. **One module per feature.** Each major feature (users, auth, games, and later purchases) lives in its own module under `modules/`.
2. **Interface first.** Define `IService` before implementing `Service`. Controllers depend on the interface only.
3. **Never expose entities.** Do not return an `Entity` directly from the API. Always use a `DTO` and a `Mapper`.
4. **Use custom exceptions.** Throw the exceptions defined in `shared/exceptions` instead of generic ones. `GlobalExceptionHandler` turns them into consistent error responses.
5. **Standard responses.** Wrap API responses in `ApiResponse`.
6. **Respect module boundaries.** Do not reach into another module's internals. `ModularityTests` verifies this, so run it before opening a pull request.
7. **Pagination and queries.** Do not combine `@EntityGraph` or fetch joins on collections with pagination, because Hibernate falls back to in-memory pagination. Use a two-phase query instead: page the IDs first, then load the associations for those IDs (see [Performance notes](#performance-notes)).

---

## Getting Started

### Prerequisites

- Java 21 (Java 17 also works)
- A running PostgreSQL instance
- An S3-compatible object store, for example MinIO
- Docker (optional, recommended for dependencies)

### Configuration

Copy the example environment file and review every value:

```bash
cp .env.example .env
```

The `.env.example` file documents each variable. In general you need to configure:

- the PostgreSQL connection (URL, user, password)
- the JWT secret and token lifetime
- the object storage endpoint, bucket and credentials (MinIO locally, Cloudflare R2 in production)
- allowed CORS origins for the frontend

Never commit `.env` or any real credentials.

### Run

Windows (PowerShell):

```powershell
.\gradlew bootRun
```

macOS / Linux:

```bash
./gradlew bootRun
```

The server starts at http://localhost:8080 and the interactive API docs are available at:

http://localhost:8080/swagger-ui/index.html

To run the whole stack (frontend, backend, database, MinIO, Nginx) with Docker Compose, use the files in the repository's `docker/` folder, as described in the [root README](../README.md).

---

## Testing

### Unit tests

Unit tests use JUnit and Mockito and currently cover these modules:

- `games`
- `users`
- `auth`

Run all tests:

```bash
./gradlew test
```

### Module structure test

`ModularityTests` checks that the modules respect their boundaries.

```bash
./gradlew clean test --tests fabricio.backend.ModularityTests --info
```

### Integration tests

Not written yet. Planned coverage: repository queries against PostgreSQL and the main API flows (auth, game publishing, asset upload).

### Test reports

After a test run, open the HTML report:

```text
backend/build/reports/tests/test/index.html
```

CI runs the backend unit tests on every push (GitHub Actions).

---

## API Overview

The API exposes 20+ REST endpoints. The full, always up-to-date list is in Swagger UI. At a high level:

| Area | Capabilities |
| :--- | :----------- |
| Auth | Register, log in, obtain and use JWT access tokens |
| Users | Profile and account management, role-based permissions, avatar upload |
| Games | Create and publish games, upload game assets and media, tags, list, search and detail |

Protected endpoints require a `Authorization: Bearer <token>` header. Access is limited by role.

---

## Storage

File storage sits behind an interface, so the same code runs against different backends:

| Environment | Implementation |
| :---------- | :------------- |
| Local / dev | MinIO |
| Production | Cloudflare R2 (S3-compatible API) |

Stored objects include user avatars and game assets (cover images, media and files).

---

## Performance Notes

Every optimization was measured with k6 (20 virtual users) against git-tagged baselines (`bench-b0` to `bench-b3`). Key results:

- Game list: p95 312 ms → 120 ms (−62%).
- Deep pagination: p95 338 ms → 163 ms (−52%).
- Game detail: p95 35 ms → 19 ms.

Lessons that shaped the code:

- N+1 queries were the main cost in the list and detail endpoints. Removing heavy media joins and optimizing DTO mapping cut latency significantly.
- `@EntityGraph` on paginated queries caused in-memory pagination and pushed p95 to about 2 s. Replacing it with a two-phase query fixed it.

The full benchmark table is in the [root README](../README.md#performance).

---

## Deployment

The backend is packaged with the `Dockerfile` in this folder and deployed to **Render** as a Docker service. The free tier may put the service to sleep when idle, so the first request after a quiet period can be slow.

---

## Adding a New Feature

1. Create a new module under `modules/<feature>/` with `web`, `application` and `domain` packages (or extend an existing module).
2. Model the entities, exceptions and repository abstractions in `domain`.
3. Define `I<Feature>Service`, then implement `<Feature>Service`, with DTOs and a mapper in `application`.
4. Add a thin controller in `web` that returns DTOs wrapped in `ApiResponse`.
5. Throw custom exceptions from `shared/exceptions`.
6. Write unit tests for the service layer.
7. Run `./gradlew test` and the `ModularityTests` check.
8. Verify the new endpoints in Swagger UI.

---

## Roadmap

- Favorites and ratings inside the `games` module
- Redesigned `purchases` module
- Integration tests