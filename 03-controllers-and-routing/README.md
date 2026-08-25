# Part 3: Controllers & Routing

## Table of Contents

1. [What Is a Controller?](#1-what-is-a-controller)
2. [Route, Query, and Body Decorators](#2-route-query-and-body-decorators)
3. [Building the `tasks` Routes](#3-building-the-tasks-routes)
4. [Trying It](#4-trying-it)
5. [Beginner Pitfalls](#5-beginner-pitfalls)

---

## 1. What Is a Controller?

A **controller** is a class whose job is to receive an HTTP request and
return a response. Nothing more — no business logic, no direct database
access. `@Controller('tasks')` tells Nest that every route inside this
class is prefixed with `/tasks`.

## 2. Route, Query, and Body Decorators

| Decorator | Maps to |
| --- | --- |
| `@Get()` | `GET` request |
| `@Post()` | `POST` request |
| `@Patch()` | `PATCH` request (partial update) |
| `@Delete()` | `DELETE` request |
| `@Param('id')` | A route parameter, e.g. `/tasks/:id` |
| `@Query('done')` | A query string parameter, e.g. `/tasks?done=true` |
| `@Body()` | The parsed request body |

These decorators pull data straight off the HTTP request and hand it to
your method as a plain argument — no manual parsing.

## 3. Building the `tasks` Routes

For now the controller calls placeholder methods on `TasksService` that
just return hardcoded data — real logic moves into the service properly in
[Part 4](../04-services-and-dependency-injection/README.md). This part
is about getting the five routes wired up and reachable.

```ts
// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(data: any) {
    return { id: Date.now(), ...data };
  }

  update(id: number, data: any) {
    return { id, ...data };
  }

  remove(id: number) {
    return { id, removed: true };
  }
}
```

```ts
// src/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.tasksService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
```

`ParseIntPipe` converts the `:id` route param from a string (all route
params start as strings) into a number, and rejects the request with a
`400` if it isn't numeric.

> **Note:** `@Body() body: any` is deliberately loose for this part — real
> input shapes and validation arrive in [Part 5](../05-dto-and-validation/README.md).

## 4. Trying It

With `npm run start:dev` running from [Part 1](../01-setup-and-project-creation/README.md):

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Learn NestJS"}'
curl -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Learn NestJS well"}'
curl -X DELETE http://localhost:3000/tasks/1
```

Every route responds — with placeholder data for now.

## 5. Beginner Pitfalls

- **Route order matters.** A literal route like `@Get('search')` must be
  declared *before* `@Get(':id')` in the same controller, or `:id` greedily
  matches `search` as its value.
- **Forgetting `Content-Type: application/json`.** Without it, Nest's
  body parser won't parse the request body and `@Body()` comes back
  `undefined`.
- **Putting logic directly in the controller.** It's tempting to compute
  the response inline here instead of delegating to the service — resist
  it now, before it becomes a habit. See [Part 4](../04-services-and-dependency-injection/README.md)
  for why.

---

Next: [Part 4 — Services & Dependency Injection](../04-services-and-dependency-injection/README.md)
