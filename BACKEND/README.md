# YUP Backend Service

This service is responsible for generating article outlines and quizzes using the Gemini AI API, with Firebase Firestore integration for data storage.

## API Endpoints

### Health Check

- **GET /health-check**
  - **Description:** Performs a basic health check of the service.
  - **Access:** Public
  - **Response:**
    - `200 OK`: `{ "status": "UP", "timestamp": "...", "environment": "..." }`

### Article Management

- **POST /api/v1/article/generate**
  - **Description:** Generates an article outline for a given topic using Gemini AI.
  - **Access:** Public
  - **Request Body:** `{ "topic": "string" }`
  - **Responses:**
    - `200 OK`: Article outline JSON array
    - `400 Bad Request`: `{ "error": "A non-empty "topic" string is required in the request body." }`
    - `500 Internal Server Error`: `{ "error": "An internal server error occurred while generating the article." }`

- **GET /api/v1/article/all**
  - **Description:** Retrieves all stored articles from Firestore.
  - **Access:** Public
  - **Responses:**
    - `200 OK`: Array of articles with IDs and data
    - `500 Internal Server Error`: `{ "error": "Failed to fetch articles from Firestore." }`

### Quiz Management

- **POST /api/v1/quiz/generate**
  - **Description:** Generates a quiz from an existing article using its document ID.
  - **Access:** Public
  - **Request Body:** `{ "docId": "string" }`
  - **Responses:**
    - `200 OK`: Generated quiz data
    - `400 Bad Request`: `{ "error": "Document ID (docId) is required." }`
    - `500 Internal Server Error`: `{ "error": "Failed to generate quiz.", "details": "..." }`
