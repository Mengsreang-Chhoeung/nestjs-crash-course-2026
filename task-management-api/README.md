# Task Management API — Reference Implementation

The finished app from the [NestJS crash course](../README.md), in its
**Part 9 end state**: five REST routes backed by PostgreSQL through
Prisma, with DTO validation, HTTP exceptions, and Swagger docs.

This is the reference solution — the thing your project should look like
after following all nine parts. Read the parts and build it yourself
first; use this to compare against when something doesn't work.

## Running it

You need Node 18+ (see [Part 1](../01-setup-and-project-creation/README.md))
and Docker.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
docker compose up -d
```

```bash
npx prisma migrate dev
```

```bash
npm run start:dev
```

The API is on `http://localhost:3000`, and Swagger UI on
`http://localhost:3000/api`.

To stop the database (keeping its data):

```bash
docker compose down
```

Add `-v` to that command to also drop the volume and start from an empty
database next time.

## Routes

| Method   | Route        | Behavior                                                       |
| -------- | ------------ | -------------------------------------------------------------- |
| `GET`    | `/tasks`     | List every task                                                |
| `GET`    | `/tasks/:id` | One task, or `404`                                             |
| `POST`   | `/tasks`     | Create a task; `400` on invalid body, `409` on duplicate title |
| `PATCH`  | `/tasks/:id` | Partial update, or `404`                                       |
| `DELETE` | `/tasks/:id` | Delete, or `404`                                               |
