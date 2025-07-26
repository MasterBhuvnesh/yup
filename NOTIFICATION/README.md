# Notification Service

This service is responsible for handling push notifications.

## API Endpoints

### Health Check

- **GET /healthcheck**
  - **Description:** Performs a basic health check of the service.
  - **Access:** Public
  - **Response:**
    - `200 OK`: `{ "status": "ok", "timestamp": "..." }`

### Token Management

- **POST /register-token**

  - **Description:** Registers a new Expo push token.
  - **Access:** Protected
  - **Request Body:** `{ "token": "..." }`
  - **Responses:**
    - `201 Created`: `{ "message": "Token stored successfully" }`
    - `400 Bad Request`: `{ "message": "Token is required" }`
    - `500 Internal Server Error`: `{ "message": "Internal server error" }`

- **GET /get-tokens**
  - **Description:** Retrieves all stored Expo push tokens.
  - **Access:** Protected
  - **Responses:**
    - `200 OK`: `[ "token1", "token2", ... ]`
    - `500 Internal Server Error`: `{ "message": "Internal server error" }`

### Notifications

- **POST /send**
  - **Description:** Sends a push notification to all registered devices.
  - **Access:** Protected
  - **Responses:**
    - `200 OK`: `{ "message": "Notifications sent to X devices", "deleted": [ ... ] }`
    - `200 OK`: `{ "message": "No tokens to send." }`
    - `500 Internal Server Error`: `{ "message": "Failed to send notifications" }`
