# Part 8: API Documentation with Swagger

## Table of Contents

1. [Why Swagger / OpenAPI](#1-why-swagger--openapi)
2. [Installing and Configuring Swagger](#2-installing-and-configuring-swagger)
3. [Documenting the DTOs](#3-documenting-the-dtos)
4. [Documenting the Controller](#4-documenting-the-controller)
5. [Trying It in the Browser](#5-trying-it-in-the-browser)
6. [Beginner Pitfalls](#6-beginner-pitfalls)

---

## 1. Why Swagger / OpenAPI

So far, trying any route meant writing a `curl` command by hand. **Swagger
UI** generates an interactive, browsable page listing every route, its
expected request body, and its possible responses — and lets you send
real requests straight from the browser. NestJS generates this
automatically from the same decorators already on your controllers and
DTOs.

## 2. Installing and Configuring Swagger

```bash
npm install @nestjs/swagger
```

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('A small task-management REST API built in the NestJS crash course')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`SwaggerModule.setup('api', app, document)` serves the UI at
`/api`.

## 3. Documenting the DTOs

`@ApiProperty()` describes each field for the generated docs — Swagger
can't infer descriptions or examples from `class-validator` decorators
alone:

```ts
// src/tasks/dto/create-task.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Learn NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Build my first API' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
```

`UpdateTaskDto` (from [Part 5](05-dto-and-validation.md))
already reuses these via `PartialType` — no changes needed there;
`@nestjs/swagger`'s `PartialType` (a drop-in replacement for the one from
`@nestjs/mapped-types`) carries the `@ApiProperty()` metadata through
automatically.

## 4. Documenting the Controller

```ts
// src/tasks/tasks.controller.ts (excerpt)
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'List all tasks' })
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // ...same pattern for the other four routes
}
```

`@ApiTags('tasks')` groups every route in this controller under one
"tasks" section in the UI; `@ApiOperation()` adds a one-line summary per
route.

## 5. Trying It in the Browser

With `npm run start:dev` running, open `http://localhost:3000/api`. You
should see all five `/tasks` routes, grouped under "tasks", each
expandable with a "Try it out" button — fill in a request body and send a
real `POST` or `PATCH` without leaving the browser.

## 6. Beginner Pitfalls

- **Forgetting `@nestjs/swagger`'s `PartialType`.** If `UpdateTaskDto`
  still imports `PartialType` from `@nestjs/mapped-types` (as in
  [Part 5](05-dto-and-validation.md)), it still works — but
  switching to `@nestjs/swagger`'s version is what carries the
  `@ApiProperty()` metadata into the generated docs for `PATCH`.
- **Exposing `/api` in production without thinking about it.** Swagger UI
  reveals your entire API surface — gate it behind an environment check
  (`if (!isProduction) SwaggerModule.setup(...)`) or auth before deploying
  publicly.
- **Letting docs drift from the code.** Because Swagger reads the same
  decorators the app runs on, docs and behavior can't drift apart the way
  a hand-written docs page can — but only if you keep the decorators
  updated when a route's actual behavior changes.

---

Next: [Part 9 — Architecture Review](09-architecture-review.md)
