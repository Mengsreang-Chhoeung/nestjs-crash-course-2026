# Crash Course — Scope

## Project overview

This repo is the free NestJS crash course — a funnel into a separate paid,
live cohort. It is a single, continuous **1-hour build**: a Task
Management REST API, built up part by part from `nest new` to a
documented, validated, database-backed API with Swagger docs. It is not a
set of isolated concept demos — later parts build directly on the project
created in Part 1. This repo is fully standalone and must not reference or
depend on anything outside itself.

The 9 parts, in build order:

1. Setup & Project Creation
2. Modules
3. Controllers & Routing
4. Services & Dependency Injection
5. DTOs & Validation
6. Database Integration (Prisma + PostgreSQL)
7. Error Handling
8. API Documentation with Swagger
9. Architecture Review

Deliberately out of scope for this crash course (each is its own future
video, and/or shows up properly-paced inside the paid cohort): guards,
interceptors, middleware, custom decorators, authentication/JWT,
authorization/RBAC, WebSockets, microservices, queues, caching, testing,
GraphQL, file upload, advanced database patterns.

## Audience / framing

- Beginner: little to no prior NestJS or backend production experience
  assumed. Explain concepts before naming them.
- Practical and hands-on — every part has a runnable, copy-pasteable code
  example that fits into the one running project, not standalone snippets.
- One project, built incrementally — `tasks/` is the only domain module
  this crash course builds. No unrelated example domains.
- Database: **PostgreSQL + Prisma**, matching the paid cohort's ORM
  decision, so the crash course previews real cohort tooling instead of
  teaching a throwaway stack.
- This content is free and public-facing: it should work as a standalone
  read, while naturally previewing the paid cohort (mentioned briefly in
  the top-level README, not repeated inside every part).

## Structure

```
nestjs-crash-course-2026/
├── CLAUDE.md                              # this file
├── README.md                              # intro + table of contents
├── docs/
│   ├── 01-setup-and-project-creation.md
│   ├── 02-modules.md
│   ├── 03-controllers-and-routing.md
│   ├── 04-services-and-dependency-injection.md
│   ├── 05-dto-and-validation.md
│   ├── 06-database-integration.md
│   ├── 07-error-handling.md
│   ├── 08-api-documentation-swagger.md
│   ├── 09-architecture-review.md
│   └── assets/
│       ├── 04-services-and-dependency-injection/*.svg
│       ├── 06-database-integration/*.svg
│       └── 09-architecture-review/*.svg
└── examples/
    └── task-management-api/               # reference implementation
        ├── README.md
        ├── docker-compose.yml             # PostgreSQL for local dev
        ├── prisma/schema.prisma
        └── src/{main.ts,app.module.ts,prisma/,tasks/}
```

Each file in `docs/` is a self-contained tutorial doc following the
conventions below, but assumes the reader has followed the prior parts in
order (same project, growing file tree). `docs/assets/0N-slug/` (where
present) holds that part's diagrams as plain SVG files.

`examples/task-management-api/` is the **runnable reference
implementation** — the one project, in its Part 9 end state only (not a
snapshot per part). It exists so students can diff against a known-good
version, and so the code in the docs is verifiable rather than assumed.
Two rules follow from that:

- **The docs and the app must not drift.** Any code change in one has to
  land in the other in the same pass — a snippet in a part's `docs/*.md`
  file should be copy-pasteable into the reference app and match what's
  there.
- **It is the crash course's app.** It must stay standalone and never
  reference or depend on anything outside this repo.

## Content conventions

- Each part's `docs/0N-slug.md` file is structured as: `# Part N: Title` →
  `## Table of Contents` (linking to the `##` sections below) → `---` →
  numbered `## <N>. <Subtopic>` sections matching the TOC.
- Written as a tutorial doc, not a video script — no "intro/outro," no
  speaker notes, no talking-to-camera phrasing.
- Explanatory prose with **bold** key terms, bullet lists, tables for
  comparisons, `> **Note:**` blockquotes for asides, fenced code blocks
  for real, runnable commands/code.
- Favor a diagram over a paragraph: any section describing a flow,
  comparison, or set of components leads with a simple SVG diagram
  (stored in `docs/assets/0N-slug/`) followed by a short bullet list —
  keep prose to a few lines per section. Diagrams are simple, clean SVGs
  (boxes, arrows, labels), viewBox-based, no external assets, 2-6 boxes,
  readable at a glance. Not every part needs one — only add a diagram
  where it genuinely clarifies a flow or structure.
- Cross-link related parts with relative markdown links (e.g. Part 3
  building on Part 2's module).
- Code examples are real, runnable, and copy-pasteable against the one
  project built across this crash course — verify each snippet is
  consistent with NestJS's actual APIs (see https://docs.nestjs.com) and
  with the file state left by the previous part.
- End each part with a short "Beginner Pitfalls" section (2-3 items) and
  a "Next: [Part N+1 — Title](0N-slug.md)" link (final part links back to
  the crash course [README](../README.md) and the paid cohort instead).
