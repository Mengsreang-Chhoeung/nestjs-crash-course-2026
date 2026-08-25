# Part 1: Setup & Project Creation

## Table of Contents

1. [What Is NestJS, and Why Not Just Express?](#1-what-is-nestjs-and-why-not-just-express)
2. [NestJS Architecture at a Glance](#2-nestjs-architecture-at-a-glance)
3. [What We're Building](#3-what-were-building)
4. [Requirements & Installing the CLI](#4-requirements--installing-the-cli)
5. [Creating the Project](#5-creating-the-project)
6. [The Generated Folder Structure](#6-the-generated-folder-structure)
7. [Running the Dev Server](#7-running-the-dev-server)
8. [Beginner Pitfalls](#8-beginner-pitfalls)

---

## 1. What Is NestJS, and Why Not Just Express?

[Express](https://expressjs.com) gives you routing and middleware and
leaves everything else — how you organize files, how you inject
dependencies, how you validate input — up to you. That's fine for a small
script. On a real API, every team ends up reinventing the same structure
by hand, differently.

**NestJS** is a framework built on top of Express (or Fastify) that
supplies that structure out of the box: a consistent way to organize code
into modules, a built-in dependency injection container, and first-class
support for TypeScript. You still write regular HTTP handlers under the
hood — Nest just gives them a shape.

## 2. NestJS Architecture at a Glance

Every NestJS app is built from four building blocks:

| Building block | Job |
| --- | --- |
| **Module** | Groups related code together and declares what it depends on |
| **Controller** | Receives HTTP requests, returns HTTP responses |
| **Provider / Service** | Holds business logic, injectable into other classes |
| **Dependency Injection** | Nest constructs your classes and wires their dependencies for you |

You'll meet each of these properly in later parts. For now, just know the
request always flows the same direction: **Controller → Service**, never
the other way around.

## 3. What We're Building

A **Task Management REST API** — a small but real backend with five
routes:

```text
GET    /tasks
GET    /tasks/:id
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

Every part in this crash course adds one layer to the same project. By
[Part 9](../09-architecture-review/README.md) it's validated, backed by a
real PostgreSQL database, and documented with Swagger.

## 4. Requirements & Installing the CLI

You need:

- **Node.js** 18 or later (`node -v` to check)
- **npm** (ships with Node)

The recommended way to install Node.js is via **nvm** (Node Version
Manager), rather than an OS package manager or the installer from
nodejs.org. nvm lets you install and switch between multiple Node
versions per-project instead of being locked to one system-wide version —
useful the moment you work on a second project that needs a different
Node version.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Restart your terminal (or `source ~/.bashrc` / `source ~/.zshrc`), then
install and switch to the latest LTS release of Node:

```bash
nvm install --lts
nvm use --lts
node -v
```

> **Note:** on Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows)
> instead — the install script above is for macOS/Linux.

Install the NestJS CLI globally:

```bash
npm install -g @nestjs/cli
```

> **Note:** you can also scaffold without a global install via
> `npx @nestjs/cli new ...` — useful if you don't want a global package.

## 5. Creating the Project

```bash
nest new task-management-api
```

The CLI asks which package manager to use — pick **npm**. It scaffolds a
full project, installs dependencies, and initializes a git repo.

## 6. The Generated Folder Structure

```text
task-management-api/
├── src/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── nest-cli.json
├── package.json
└── tsconfig.json
```

Four files matter most right now:

- **`main.ts`** — the entry point. Creates the Nest application and starts
  it listening.
- **`app.module.ts`** — the **root module**. Every other module in the app
  eventually gets imported here, directly or indirectly.
- **`app.controller.ts`** — a placeholder controller with one route
  (`GET /`), which you'll replace with your own in [Part 3](../03-controllers-and-routing/README.md).
- **`app.service.ts`** — a placeholder service the controller calls into.

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`NestFactory.create(AppModule)` is the whole story of how a Nest app
starts: it reads the root module, resolves everything it imports, builds
the dependency graph, and hands you back a running HTTP server.

## 7. Running the Dev Server

```bash
cd task-management-api
npm run start:dev
```

`start:dev` runs Nest in watch mode — it rebuilds and restarts on every
file save. Visit `http://localhost:3000` — you should see `Hello World!`,
served by the placeholder `AppController`.

## 8. Beginner Pitfalls

- **Confusing `npm run start` with `npm run start:dev`.** Plain `start`
  builds once and exits on changes; `start:dev` watches. Use `start:dev`
  for everything in this crash course.
- **Editing `main.ts` to add routes.** `main.ts` only bootstraps the app —
  routes belong in controllers ([Part 3](../03-controllers-and-routing/README.md)),
  never here.
- **Port already in use.** If `3000` is taken by another process, either
  stop that process or start on a different port — `app.listen` already
  reads `process.env.PORT`, so `PORT=3001 npm run start:dev` is enough.

---

Next: [Part 2 — Modules](../02-modules/README.md)
