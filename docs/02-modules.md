# Part 2: Modules

## Table of Contents

1. [What Is a Module?](#1-what-is-a-module)
2. [Why NestJS Organizes Code This Way](#2-why-nestjs-organizes-code-this-way)
3. [Generating the `tasks` Module](#3-generating-the-tasks-module)
4. [Registering It on the Root Module](#4-registering-it-on-the-root-module)
5. [Beginner Pitfalls](#5-beginner-pitfalls)

---

## 1. What Is a Module?

A NestJS **module** is a class decorated with `@Module()` that tells Nest
how a group of related files fit together:

- `controllers` — classes handling incoming HTTP requests (built in
  [Part 3](03-controllers-and-routing.md)).
- `providers` — classes (usually services) holding logic, injectable
  elsewhere (built in [Part 4](04-services-and-dependency-injection.md)).
- `imports` — other modules this module depends on.
- `exports` — which of this module's providers other modules may use.

Every Nest app has at least one module — the **root module**,
`AppModule` — and typically one module per feature domain after that.

## 2. Why NestJS Organizes Code This Way

A brand-new app could put everything in `src/`:
`tasks.controller.ts`, `tasks.service.ts`, all siblings in one flat
folder. That's fine for a five-minute demo. It stops being fine once an
app has several domains — you can no longer tell at a glance which files
belong together, or what depends on what.

Feature modules fix this by giving each domain its own folder and its own
explicit boundary:

```text
src/
├── tasks/
│   ├── tasks.module.ts
│   ├── tasks.controller.ts
│   └── tasks.service.ts
└── app.module.ts
```

## 3. Generating the `tasks` Module

The Nest CLI can scaffold this for you:

```bash
nest generate module tasks
nest generate controller tasks
nest generate service tasks
```

This creates `src/tasks/tasks.module.ts`, `tasks.controller.ts`, and
`tasks.service.ts` — and automatically wires the controller and service
into the module's `controllers` and `providers` arrays:

```ts
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

## 4. Registering It on the Root Module

Generating a module doesn't automatically make Nest use it — it has to be
imported somewhere Nest actually loads. The CLI does this for you too when
you run `nest generate module`, but it's worth seeing explicitly:

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
```

`AppModule`'s `imports` array is where every feature module in the app
ultimately gets registered, directly or through another module.

## 5. Beginner Pitfalls

- **Forgetting to register the module.** A `TasksModule` that's never
  added to `AppModule`'s `imports` quietly does nothing — no error, just
  every route inside it 404ing.
- **Exporting everything "just in case."** Only add a provider to
  `exports` when another module genuinely needs to inject it. Exporting
  by default defeats the point of the module boundary.
- **One giant module for the whole app.** It's tempting to keep adding
  controllers/providers to `AppModule` directly instead of creating a
  feature module. Do this a few times and `AppModule` becomes unreadable —
  one module per domain, from the start.

---

Next: [Part 3 — Controllers & Routing](03-controllers-and-routing.md)
