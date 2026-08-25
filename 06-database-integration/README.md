# Part 6: Database Integration (Prisma + PostgreSQL)

## Table of Contents

1. [Why a Real Database](#1-why-a-real-database)
2. [Installing Prisma](#2-installing-prisma)
3. [Defining the `Task` Model](#3-defining-the-task-model)
4. [Running the Migration](#4-running-the-migration)
5. [A `PrismaService`](#5-a-prismaservice)
6. [Rewriting `TasksService` Against Prisma](#6-rewriting-tasksservice-against-prisma)
7. [Beginner Pitfalls](#7-beginner-pitfalls)

---

## 1. Why a Real Database

Every task created so far lives in a plain array inside `TasksService` —
it's gone the moment the server restarts. A real API needs data that
survives restarts and can be queried properly. This crash course uses
**PostgreSQL** as the database and **Prisma** as the ORM — the same combo
used in the paid, live cohort this crash course previews — so what you
build here transfers directly.

![Client through Controller, Service, PrismaService, to PostgreSQL](assets/layered-architecture.svg)

- **Controller** — unchanged from [Part 3](../03-controllers-and-routing/README.md).
- **Service** — same public methods as [Part 4](../04-services-and-dependency-injection/README.md),
  now backed by Prisma instead of an array.
- **PrismaService** — wraps Prisma's generated client so it can be
  injected like any other provider.
- **PostgreSQL** — where the data actually lives.

## 2. Installing Prisma

You need a running PostgreSQL instance. Rather than installing Postgres on
your machine, run it in Docker — create a `docker-compose.yml` in the
project root:

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:17
    container_name: task-api-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: task_api
    ports:
      - '5432:5432'
    volumes:
      - task-api-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres -d task_api']
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  task-api-db-data:
```

Start it:

```bash
docker compose up -d --wait
```

`--wait` holds until the healthcheck passes, so the next command won't run
against a database that's still booting. The named volume means your data
survives `docker compose down` — use `docker compose down -v` when you
actually want a clean slate.

Then install Prisma and initialize it:

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

`prisma init` creates a `prisma/schema.prisma` file and a `.env` with a
`DATABASE_URL` placeholder. Point it at the database above:

```text
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_api?schema=public"
```

## 3. Defining the `Task` Model

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  done        Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

This mirrors the `Task` shape from [Part 4](../04-services-and-dependency-injection/README.md) —
Prisma's schema is the new single source of truth for it.

## 4. Running the Migration

```bash
npx prisma migrate dev --name init
```

This creates the `Task` table in PostgreSQL, and generates a fully typed
Prisma Client into `node_modules/@prisma/client` matching your schema
exactly — `prisma.task.findMany()` is typed, autocompletes, and would fail
to compile if the schema didn't have a `Task` model.

## 5. A `PrismaService`

Wrap `PrismaClient` in an `@Injectable()` service so Nest's DI container
can hand it to anything that needs it, and so the connection lifecycle
ties into Nest's own:

```bash
nest generate module prisma
nest generate service prisma
```

```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

```ts
// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

`PrismaModule` exports `PrismaService` so any other module — like
`TasksModule` — can import `PrismaModule` and inject it, the same pattern
from [Part 2](../02-modules/README.md).

```ts
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

## 6. Rewriting `TasksService` Against Prisma

Same public method signatures as [Part 4](../04-services-and-dependency-injection/README.md) —
`TasksController` doesn't change at all — only what's inside each method:

```ts
// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  async update(id: number, data: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { removed: true };
  }
}
```

`findOne` inside `update`/`remove` isn't redundant — it's what turns
Prisma's own "record not found" error into the same `NotFoundException`
used everywhere else, so callers get one consistent error shape. That
shape gets formalized in [Part 7](../07-error-handling/README.md).

## 7. Beginner Pitfalls

- **Forgetting to re-run `npx prisma generate`** after editing
  `schema.prisma` without `migrate dev` (e.g. after pulling someone
  else's schema change) — the typed client goes stale and won't match the
  database.
- **Committing `.env` with real credentials.** Keep `.env` out of version
  control; commit a `.env.example` instead.
- **Calling `prisma.task.update` without checking existence first.**
  Prisma throws its own `PrismaClientKnownRequestError` (code `P2025`) on
  a missing record, not a Nest `NotFoundException` — hence the explicit
  `findOne` guard above, which [Part 7](../07-error-handling/README.md)
  builds on.

---

Next: [Part 7 — Error Handling](../07-error-handling/README.md)
