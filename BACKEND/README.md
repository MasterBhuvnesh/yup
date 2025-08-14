# YUP Backend Service

This backend service provides endpoints to generate and retrieve articles, quizzes, summaries, facts, and subtopics using the Gemini AI API and stores data in Firebase Firestore. It is built with TypeScript, Express, and Node.js, and supports Docker and Bun for deployment.

## API Endpoints

All endpoints are registered at the root (`/`).

### Health Check

- **GET `/health-check`**: Returns service status, timestamp, and environment.

### Content Generation

- **POST `/content`**: Generates and saves all content (articles, quizzes, summaries, facts, subtopics) for a given topic.

### Article

- **GET `/generate`**: Generates or retrieves an article by ID.

### Quiz

- **GET `/quiz`**: Retrieves a quiz for a given article document ID.

### Summary

- **GET `/summary`**: Retrieves a summary for a given article document ID.

### Facts

- **GET `/facts`**: Retrieves facts for a given article document ID.

### Subtopics

- **GET `/subtopic`**: Retrieves all subtopic titles.

All endpoints return JSON responses. Error handling is provided for missing parameters and internal errors.

## Architecture & Features

- **TypeScript & Express**: Modern, type-safe backend
- **Firebase Firestore**: Used for persistent storage
- **Gemini AI API**: Used for content and quiz generation
- **SHA-256 Utility**: For secure hashing (see `src/utils/index.ts`)
- **Environment-based config**: Uses `.env` for secrets and environment variables
- **Health Check Cron**: Periodically pings `/health-check` and logs status
- **Docker & Bun Support**: Can be run in Docker or with Bun runtime
- **Production Ready**: Strict error handling, environment validation, and scalable structure

## Setup & Usage

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file with required variables (see `src/config/index.ts` for required keys like `GEMINI_API_KEY`, `NODE_ENV`, etc.)
3. Build and run:

```sh
npm run build
npm start
```

Or for development:

```sh
npm run dev
```

## Environment Variables

- `GEMINI_API_KEY` (required)
- `NODE_ENV` (`development` or `production`)
- `PORT` (optional, default: 3000)
- `API_URL` (required in production)


