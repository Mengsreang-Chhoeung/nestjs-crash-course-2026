# NestJS Crash Course — Build a REST API in 1 Hour

This is a free, self-contained crash course that builds one complete
project from start to finish: a **Task Management REST API**, using
NestJS, PostgreSQL, and Prisma. By the end you'll have a working,
validated, documented API — and understand the relationship between
**Module → Controller → Service → Prisma → PostgreSQL**.

It's for developers who are brand new to NestJS, or who've only skimmed
the docs. No prior production backend experience assumed.

## Table of Contents

1. [Setup & Project Creation](01-setup-and-project-creation/README.md)
2. [Modules](02-modules/README.md)
3. [Controllers & Routing](03-controllers-and-routing/README.md)
4. [Services & Dependency Injection](04-services-and-dependency-injection/README.md)
5. [DTOs & Validation](05-dto-and-validation/README.md)
6. [Database Integration (Prisma + PostgreSQL)](06-database-integration/README.md)
7. [Error Handling](07-error-handling/README.md)
8. [API Documentation with Swagger](08-api-documentation-swagger/README.md)
9. [Architecture Review](09-architecture-review/README.md)

## What you'll build

```text
GET    /tasks
GET    /tasks/:id
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

A single `tasks` feature module, backed by a real PostgreSQL database via
Prisma, with request validation, proper HTTP error responses, and a live
Swagger UI to try it all from the browser.

## The finished code

[`task-management-api/`](task-management-api/README.md) holds the complete
project in its Part 9 end state, ready to run. Build it yourself by
following the parts in order — then use that folder to compare against
when something doesn't line up.
