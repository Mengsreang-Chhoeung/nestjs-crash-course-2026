# Part 7: Error Handling

## Table of Contents

1. [Why Not Just Return `null`](#1-why-not-just-return-null)
2. [Built-in HTTP Exceptions](#2-built-in-http-exceptions)
3. [Using Them in `TasksService`](#3-using-them-in-tasksservice)
4. [Trying It](#4-trying-it)
5. [Beginner Pitfalls](#5-beginner-pitfalls)

---

## 1. Why Not Just Return `null`

```text
GET /tasks/999
```

If a task with id `999` doesn't exist, what should the API return? Silently
returning `null` with a `200 OK` forces every caller to remember to check
for it, and gives no hint about *why* there's no data — not found?
Not authorized? A bug? An HTTP API has a better tool: **status codes**.

```json
{
  "message": "Task 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

is unambiguous — the status code alone tells the caller what happened,
before it even reads the body.

## 2. Built-in HTTP Exceptions

Nest ships a set of exception classes in `@nestjs/common`, each mapped to
the right HTTP status code. Throwing one anywhere in a request's call
stack — controller or service — is caught automatically by Nest's
built-in exception layer and turned into the matching HTTP response.

| Exception | Status | Use for |
| --- | --- | --- |
| `BadRequestException` | 400 | Malformed input the caller sent |
| `NotFoundException` | 404 | Nothing at that id/route |
| `ConflictException` | 409 | Request conflicts with current state (e.g. duplicate) |
| `InternalServerErrorException` | 500 | Unexpected server-side failure |

`TasksService` already throws `NotFoundException` in
[Part 6](../06-database-integration/README.md) — this part is about
recognizing *when* to reach for each one, not introducing new syntax.

## 3. Using Them in `TasksService`

`findOne` already throws correctly:

```ts
async findOne(id: number) {
  const task = await this.prisma.task.findUnique({ where: { id } });
  if (!task) throw new NotFoundException(`Task ${id} not found`);
  return task;
}
```

Add a `ConflictException` for a business rule — say, a task's `title`
must be unique:

```ts
// src/tasks/tasks.service.ts (excerpt)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

async create(data: CreateTaskDto) {
  const existing = await this.prisma.task.findFirst({ where: { title: data.title } });
  if (existing) throw new ConflictException(`A task titled "${data.title}" already exists`);
  return this.prisma.task.create({ data });
}
```

You don't need a `try/catch` in the controller — an uncaught exception
thrown anywhere in the service propagates up automatically and Nest's
built-in filter converts it to the right JSON response and status code.

## 4. Trying It

```bash
curl -i http://localhost:3000/tasks/999
```

```text
HTTP/1.1 404 Not Found

{"message":"Task 999 not found","error":"Not Found","statusCode":404}
```

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn NestJS"}'
```

Run that same command twice — the second call returns `409 Conflict`.

## 5. Beginner Pitfalls

- **Throwing plain `Error` instead of an `HttpException` subclass.** A
  regular `throw new Error('not found')` isn't recognized by Nest's
  exception layer — it becomes an unhandled `500`, hiding the real intent.
- **Catching exceptions in the controller "to be safe."** There's no need
  — Nest already catches uncaught exceptions from anywhere in the request
  and formats the response. Catch only where you plan to actually handle
  or transform the error.
- **Returning `200` with an error message in the body.** This defeats the
  point of status codes — callers (and tools like Swagger, [Part 8](../08-api-documentation-swagger/README.md))
  can no longer tell success from failure without parsing the body.

---

Next: [Part 8 — API Documentation with Swagger](../08-api-documentation-swagger/README.md)
