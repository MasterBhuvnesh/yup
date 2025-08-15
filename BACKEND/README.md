# YUP Backend Service

A robust TypeScript/Express backend for generating, storing, and retrieving articles, quizzes, summaries, facts, and topic data using the Gemini AI API and Firebase Firestore. Includes detailed API endpoints, error handling, and scalable architecture.

## 🚀 Features

- **Content Generation**: Generate articles, quizzes, summaries, and facts using Gemini AI
- **Firestore Integration**: Store and retrieve all content in Firebase Firestore
- **Structured Data API**: Fetch all topics and their subtopics
- **TypeScript & Express**: Modern, type-safe backend
- **Health Monitoring**: Built-in health check endpoint and cron job
- **Error Handling**: Consistent error responses for all endpoints
- **Docker & Bun Support**: Containerized and Bun-compatible

## 📋 Prerequisites

- Node.js >= 18 (or Bun >= 1.1.13)
- Firebase project with Firestore enabled
- Gemini API key

## 🛠️ Installation

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Environment Setup**
   - Copy `.env.sample` to `.env` and fill in required values (see below)
3. **Build and run**
   ```sh
   npm run build
   npm start
   # or for development
   npm run dev
   ```

## ⚙️ Environment Variables

| Variable         | Description                          | Required |
| ---------------- | ------------------------------------ | -------- |
| `NODE_ENV`       | Environment (development/production) | Yes      |
| `PORT`           | Server port (default: 3000)          | No       |
| `GEMINI_API_KEY` | Gemini API key                       | Yes      |
| `API_URL`        | Base URL (required in production)    | Yes      |
| Firebase vars    | See your Firebase service account    | Yes      |

## 📚 API Documentation

All endpoints return JSON. Unless otherwise noted, all errors return a JSON object with `error` and `details` fields.

### Health Check

- **GET** `/health-check`
  - **Description**: Check service health status
  - **Response**:
    ```json
    { "status": "UP", "timestamp": "...", "environment": "..." }
    ```

### Generate and Save All Content

- **POST** `/content`
  - **Description**: Generate and save article, facts, quiz, and summary for a topic
  - **Request Body**:
    ```json
    { "topic": "string" }
    ```
  - **Response**:
    ```json
    { "id": "docId", "title": "...", "createdAt": "...", "article": {...}, "facts": [...], "quiz": {...}, "summary": {...} }
    ```
  - **Errors**:
    - `400`: `{ "error": "A \"topic\" is required." }`
    - `500`: `{ "error": "Failed to generate all content.", "details": "..." }`

### Get Article by ID

- **GET** `/generate`
  - **Description**: Retrieve an article by document ID
  - **Request Body**:
    ```json
    { "docId": "string" }
    ```
  - **Response**:
    ```json
    { "id": "docId", "article": {...} }
    ```
  - **Errors**:
    - `404`: `{ "error": "Article not found." }`
    - `500`: `{ "error": "Failed to fetch article.", "details": "..." }`

### Get Quiz by Article ID

- **GET** `/quiz`
  - **Description**: Retrieve quiz for an article document
  - **Request Body**:
    ```json
    { "docId": "string" }
    ```
  - **Response**:
    ```json
    { "quiz": {...} }
    ```
  - **Errors**:
    - `404`: `{ "error": "Article not found." }` or `{ "error": "A quiz has not been generated or saved for this article yet." }`
    - `500`: `{ "error": "Failed to fetch quiz.", "details": "..." }`

### Get Summary by Article ID

- **GET** `/summary`
  - **Description**: Retrieve summary for an article document
  - **Request Body**:
    ```json
    { "docId": "string" }
    ```
  - **Response**:
    ```json
    { "summary": {...} }
    ```
  - **Errors**:
    - `404`: `{ "error": "Article not found." }` or `{ "error": "A summary has not been generated or saved for this article yet." }`
    - `500`: `{ "error": "Failed to fetch summary.", "details": "..." }`

### Get Facts by Article ID

- **GET** `/facts`
  - **Description**: Retrieve facts for an article document
  - **Request Body**:
    ```json
    { "docId": "string" }
    ```
  - **Response**:
    ```json
    { "facts": [...] }
    ```
  - **Errors**:
    - `404`: `{ "error": "Article not found." }` or `{ "error": "Facts have not been generated or saved for this article yet." }`
    - `500`: `{ "error": "Failed to fetch facts.", "details": "..." }`

### Get All Topics and Subtopics

- **GET** `/data`
  - **Description**: Retrieve all collections (topics) and their document titles (subtopics)
  - **Response**:
    ```json
    [
    	{ "topic": "collectionName", "subtopics": ["title1", "title2", ...] },
    	...
    ]
    ```
  - **Errors**:
    - `500`: `{ "error": "Failed to fetch data.", "details": "..." }`

## 🏗️ Architecture

```
src/
├── config/         # Configuration (Firebase, Gemini, env)
├── controllers/    # Route handlers (main, helper)
├── routes/         # API route definitions
├── services/       # Business logic (AI, Firestore)
├── utils/          # Utility functions (e.g., SHA-256)
└── app.ts          # Express app setup
```

## 🧪 Development & Testing

- **Run in dev mode:** `npm run dev`
- **Build:** `npm run build`
- **Start:** `npm start`
- **Lint:** `npm run lint`

## 🐳 Docker Deployment

```sh
# Build the image
docker build -t yup-backend .
# Run the container
docker run -p 3000:3000 --env-file .env yup-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature/your-feature`
6. Submit a pull request

---

**Author**: Bhuvnesh Verma

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
