# Part 5: DTOs & Validation

## Table of Contents

1. [What Is a DTO?](#1-what-is-a-dto)
2. [Installing `class-validator` and `class-transformer`](#2-installing-class-validator-and-class-transformer)
3. [Writing `CreateTaskDto` and `UpdateTaskDto`](#3-writing-createtaskdto-and-updatetaskdto)
4. [Enabling the `ValidationPipe`](#4-enabling-the-validationpipe)
5. [Trying It](#5-trying-it)
6. [Beginner Pitfalls](#6-beginner-pitfalls)

---

## 1. What Is a DTO?

A **DTO** (Data Transfer Object) is a plain class describing the shape of
data crossing an HTTP boundary — what a request body is allowed to look
like. It's separate from however the data ends up stored; a DTO describes
input, not persistence.

So far, `TasksController` accepts `@Body() body: any` — meaning *any*
JSON at all, including garbage, gets passed straight into `TasksService`.
Never trust incoming request data blindly; a DTO plus a validation pipe is
how Nest enforces a shape before your code ever sees the body.

## 2. Installing `class-validator` and `class-transformer`

```bash
npm install class-validator class-transformer
```

- **`class-validator`** — decorators like `@IsString()` that declare
  validation rules directly on a class's properties.
- **`class-transformer`** — turns a plain JSON object into an instance of
  your DTO class so those decorators can run against it.

## 3. Writing `CreateTaskDto` and `UpdateTaskDto`

```ts
// src/tasks/dto/create-task.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
```

```ts
// src/tasks/dto/update-task.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```

`PartialType` (from `@nestjs/mapped-types`, install with
`npm install @nestjs/mapped-types`) reuses every rule from
`CreateTaskDto` but makes each field optional — exactly what a `PATCH`
needs, without repeating the decorators.

Now update the controller to use them instead of `any`:

```ts
// src/tasks/tasks.controller.ts (relevant excerpt)
@Post()
create(@Body() body: CreateTaskDto) {
  return this.tasksService.create(body);
}

@Patch(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
  return this.tasksService.update(id, body);
}
```

## 4. Enabling the `ValidationPipe`

Declaring a DTO type does nothing by itself — TypeScript types disappear
at runtime. Nest needs a `ValidationPipe` to actually run the
`class-validator` decorators against the incoming body:

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- **`whitelist: true`** — strips any property not declared on the DTO,
  instead of passing it through silently.
- **`transform: true`** — converts the plain request body into a real
  instance of the DTO class (and coerces types like route params), so
  `class-validator`'s decorators have something to run against.

## 5. Trying It

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn NestJS","description":"Build my first API"}'
```

Returns the created task. Now try an invalid body:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Missing a title"}'
```

Returns a `400 Bad Request` with a message explaining `title` is required
— before the request ever reaches `TasksService`.

## 6. Beginner Pitfalls

- **Forgetting `app.useGlobalPipes(new ValidationPipe())`.** Without it,
  DTOs are just TypeScript types — decorators like `@IsString()` are
  silently never checked.
- **Leaving `whitelist` off.** Extra fields in the body (like an
  attacker-supplied `id` or `isAdmin`) pass straight through to your
  service instead of being stripped.
- **Validating in the service instead of the DTO.** It's tempting to add
  `if (!title) throw ...` inside `TasksService`. Push validation to the
  DTO/pipe layer instead — it runs before the controller method is even
  called, and keeps the rule in one declarative place.

---

Next: [Part 6 — Database Integration (Prisma + PostgreSQL)](06-database-integration.md)
