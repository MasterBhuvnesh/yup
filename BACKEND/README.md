# YUP Backend Service

This service generates article outlines and quizzes using the Gemini AI API, with Firebase Firestore for data storage.

## API Endpoints

### Health Check

- **GET `/health-check`**
  - **Description:** Checks if the service is running.
  - **Access:** Public
  - **Response:**  
    - `200 OK`:  
      ```json
      { "status": "UP", "timestamp": "...", "environment": "..." }
      ```

### Article Management

- **POST `/generate`**
  - **Description:** Generates an article outline for a given topic using Gemini AI.
  - **Access:** Public
  - **Request Body:**  
    ```json
    { "topic": "string" }
    ```
  - **Responses:**
    - `200 OK`: Article outline as a JSON array
    - `400 Bad Request`:  
      ```json
      { "error": "A non-empty \"topic\" string is required in the request body." }
      ```
    - `500 Internal Server Error`:  
      ```json
      { "error": "An internal server error occurred while generating the article." }
      ```

- **GET `/all`**
  - **Description:** Retrieves all stored articles from Firestore.
  - **Access:** Public
  - **Responses:**
    - `200 OK`: Array of articles with IDs and data
    - `500 Internal Server Error`:  
      ```json
      { "error": "Failed to fetch articles from Firestore." }
      ```

### Quiz Management

- **POST `/quiz`**
  - **Description:** Generates a quiz from an existing article using its document ID.
  - **Access:** Public
  - **Request Body:**  
    ```json
    { "docId": "string" }
    ```
  - **Responses:**
    - `200 OK`: Generated quiz data
    - `400 Bad Request`:  
      ```json
      { "error": "Document ID (docId) is required." }
      ```
    - `500 Internal Server Error`:  
      ```json
      { "error": "Failed to generate quiz.", "details": "..." }
      ```

## Architecture

- **Caching:** Redis
- **Load Balancing:** Nginx, AWS ELB, Cloudflare
- **Bulk Data Return:** Optimized to reduce Firestore read/write operations
- **Rate Limiting:** Redis
- **Horizontal Scaling:** Docker Swarm
- **Runtime Environment:** Bun, TypeScript
- **Containerization:** Docker
- **CI/CD Pipeline:** GitHub Actions