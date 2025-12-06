# Studzee API

This is a production-ready backend service written in **TypeScript** that exposes a public `GET /content` endpoint (list of document titles) and an authenticated `GET /content/:id` endpoint (full document). It uses **MongoDB** for storage and **Redis** for caching.

This project was bootstrapped with Gemini.

## Features

- **Express.js** server with TypeScript.
- **MongoDB** for data storage via Mongoose.
- **Redis Stack** for caching and advanced data structures.
- **Clerk** for authentication and user management.
- **Zod** for robust schema validation.
- **Scheduled Jobs** (`node-cron`) for daily cache refreshing.
- **Structured Logging** with `pino`.
- **Containerized** with Docker and Docker Compose.
- **Developer Tooling**: ESLint, Prettier, and a Makefile.

## Project Structure

```
.
├── src
│   ├── api             # Express routes and controllers
│   ├── config          # App configuration, DB/cache connectors
│   ├── core            # Core business logic (services)
│   ├── jobs            # Scheduled jobs (e.g., cache refresh)
│   ├── middleware      # Express middleware (auth, error handling)
│   ├── models          # Zod schemas and Mongoose models
│   ├── scripts         # Standalone scripts (seeding, manual jobs)
│   └── utils           # Utility functions (e.g., logger)
├── .env.example        # Example environment variables
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Application Dockerfile
├── Makefile            # Development commands
└── package.json
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+) and npm
- `make` (optional, for convenience)

### 1. Clone the repository

```bash
git clone <repository-url>
cd BACKEND
```

### 2. Set up environment variables

Copy the example environment file and update it with your configuration.

```bash
cp .env.example .env
```

You must set `CLERK_SECRET_KEY` from your Clerk dashboard and the MongoDB credentials.

### 3. Build and run with Docker Compose

This is the recommended way to run the application for development. It will start the API server, MongoDB, Redis, and the admin dashboards.

```bash
make up
```

The API will be available at `http://localhost:4000`.

### 4. Seed the database

To populate the database with initial data, run the seed script:

```bash
make seed
```

This will execute the `src/scripts/seed.ts` script inside the running `api` container.

### 5. Accessing the Dashboards

The development environment includes web-based dashboards to view your data:

- **MongoDB Dashboard (Mongo Express):**
  - **URL:** [http://localhost:8081](http://localhost:8081)
  - Login with the `MONGO_ROOT_USER` and `MONGO_ROOT_PASSWORD` from your `.env` file.

- **Redis Dashboard (RedisInsight):**
  - **URL:** [http://localhost:8001](http://localhost:8001)
  - On first launch, you will need to manually add the database connection. Use the default host (`localhost`) and port (`6379`) and give it a name.

## API Endpoints

### Health Checks

- `GET /health/liveness` - Checks if the app is running.
- `GET /health/readiness` - Checks if DB and Redis are connected.

### Authentication

Authentication is handled by **Clerk**. Your frontend application should use a Clerk SDK to sign users in. The JWT obtained from Clerk must be sent in the `Authorization` header for protected routes.

### Content

- `GET /content?page=1&limit=10`
  - **Description**: Returns a paginated list of documents.
  - **Access**: Public.

- `GET /content/:id`
  - **Description**: Returns a single full document by its ID.
  - **Access**: Authenticated.
  - **Headers**:
    - `Authorization: Bearer <CLERK_JWT_TOKEN>`

### Example `curl` commands

1.  **Get the public list of content:**

    ```bash
    curl "http://localhost:4000/content?page=1&limit=5"
    ```

2.  **Get a specific document (replace `<TOKEN>` and `<DOCUMENT_ID>`):**

    First, get a JWT from your Clerk-enabled frontend. Then, use it in the request:

    ```bash
    curl -H "Authorization: Bearer <YOUR_CLERK_TOKEN>" http://localhost:4000/content/<DOCUMENT_ID>
    ```

## Caching

The service implements two layers of caching in Redis:

1.  **List Cache**: Caches the response for `GET /content`.
    - **Key**: `content:list:page:<page>:limit:<limit>`
    - **TTL**: 5 minutes (configurable via `LIST_CACHE_TTL`).

2.  **Document Cache**: Caches the full document for `GET /content/:id`.
    - **Key**: `content:doc:<id>`
    - **TTL**: 24 hours (configurable via `DOC_CACHE_TTL`).

A daily background job runs to find new documents and warm the document cache. You can run this job manually:

```bash
make refresh-cache
```

## Development Commands (Makefile)

- `make up`: Start all services.
- `make down`: Stop all services.
- `make logs`: Tail the logs from the API container.
- `make test`: Run the test suite.
- `make lint`: Lint the codebase.
- `make fmt`: Format the codebase with Prettier.
- `make seed`: Populate the database with sample data.
- `make refresh-cache`: Manually run the cache refresh job.
- `make build`: Build the TypeScript project.

## Testing

The project uses `vitest` for testing.

To run all tests:

```bash
npm test
```
