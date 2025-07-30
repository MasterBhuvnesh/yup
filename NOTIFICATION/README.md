# Notification Service

This service manages push notifications.

## API Endpoints

### Health Check

- **GET /healthcheck**
  - **Description:** Checks if the service is running.
  - **Access:** Public
  - **Response:**
    - `200 OK`: `{ "status": "ok", "timestamp": "..." }`

### Token Management

- **POST /register-token**
  - **Description:** Stores a new Expo push token.
  - **Access:** Protected
  - **Request Body:** `{ "token": "..." }`
  - **Responses:**
    - `201 Created`: `{ "message": "Token stored successfully" }`
    - `400 Bad Request`: `{ "message": "Token is required" }`
    - `500 Internal Server Error`: `{ "message": "Internal server error" }`

- **GET /get-tokens**
  - **Description:** Returns all saved Expo push tokens.
  - **Access:** Protected
  - **Responses:**
    - `200 OK`: `[ "token1", "token2", ... ]`
    - `500 Internal Server Error`: `{ "message": "Internal server error" }`

### Notifications

- **GET /send**
  - **Description:** Sends push notifications to all registered devices.
  - **Access:** Protected
  - **Responses:**
    - `200 OK`: `{ "message": "Notifications sent to X devices", "deleted": [ ... ] }`
    - `200 OK`: `{ "message": "No tokens to send." }`
    - `500 Internal Server Error`: `{ "message": "Failed to send notifications" }`

> **Note:**  
> Use `bun do-release`, `bun do-release:minor`, or `bun do-release:major` only when you are ready to build and deploy.

## To Do
- [ ] Define architecture & enhance security for the get tokens endpoint
