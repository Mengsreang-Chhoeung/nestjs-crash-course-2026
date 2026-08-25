# NestJS Crash Course — Build a REST API in 1 Hour

This is a free, self-contained crash course that builds one complete
project from start to finish: a **Task Management REST API**, using
NestJS, PostgreSQL, and Prisma. By the end you'll have a working,
validated, documented API — and understand the relationship between
**Module → Controller → Service → Prisma → PostgreSQL**.

It's for developers who are brand new to NestJS, or who've only skimmed
the [official docs](https://docs.nestjs.com/). No prior production
backend experience assumed.

## Table of Contents

1. [Setup & Project Creation](docs/01-setup-and-project-creation.md)
2. [Modules](docs/02-modules.md)
3. [Controllers & Routing](docs/03-controllers-and-routing.md)
4. [Services & Dependency Injection](docs/04-services-and-dependency-injection.md)
5. [DTOs & Validation](docs/05-dto-and-validation.md)
6. [Database Integration (Prisma + PostgreSQL)](docs/06-database-integration.md)
7. [Error Handling](docs/07-error-handling.md)
8. [API Documentation with Swagger](docs/08-api-documentation-swagger.md)
9. [Architecture Review](docs/09-architecture-review.md)

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

[`examples/task-management-api/`](examples/task-management-api/README.md)
holds the complete project in its Part 9 end state, ready to run. Build it
yourself by following the parts in order — then use that folder to
compare against when something doesn't line up.

## Learn more

This crash course covers the ground you need for one working API, not
the whole framework. For everything beyond that — deeper dives into
guards, interceptors, middleware, authentication, microservices, and
more — see the [official NestJS documentation](https://docs.nestjs.com/).
