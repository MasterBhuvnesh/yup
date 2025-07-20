Gemini Article Generator API
A production-level Node.js, Express, and TypeScript API that uses the Google Gemini API to generate detailed article outlines in a structured JSON format based on a given topic.

Features
AI-Powered Content Generation: Leverages the gemini-1.5-flash model to create rich, structured JSON data.

RESTful API: Provides a clean, versioned REST API endpoint (/api/v1/article/generate).

Production-Ready Structure: Code is modularized into controllers, services, routes, and configuration for maintainability.

Input Validation: Ensures that the API receives the correct input before processing.

Health Check: Includes a /health-check endpoint for monitoring.

Automated Cron Job: A cron job runs every minute to ping the health check endpoint, useful for uptime monitoring or keeping serverless instances warm.

Project Structure
/gemini-article-api-prod
├── /dist                 # Compiled JavaScript output
├── /src                  # TypeScript source code
│   ├── /config           # Environment variables and client initializations
│   ├── /controllers      # Request and response handlers
│   ├── /routes           # API route definitions
│   ├── /services         # Core business logic (Gemini API interaction)
│   ├── app.ts            # Express app configuration, middleware, and cron job
│   └── index.ts          # Server entry point
├── .env                  # Environment variables (API Key, Port)
├── .gitignore            # Files and folders to ignore in Git
├── .prettierrc           # Prettier code formatting rules
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript compiler options

Prerequisites
Node.js (v18.0 or newer is recommended for the native fetch API)

npm (comes with Node.js)

A Google Gemini API Key.

Installation
Clone the repository:

git clone <your-repository-url>
cd gemini-article-api-prod

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the root of the project and add your Gemini API key:

# Your Google AI Studio API Key
GEMINI_API_KEY="YOUR_API_KEY_HERE"

# The port for the Express server (optional, defaults to 3000)
PORT=3000

Running the Application
Development Mode
This command starts the server with ts-node-dev, which automatically restarts the server on file changes.

npm run dev

Production Mode
First, build the TypeScript code into JavaScript:

npm run build

Then, start the server:

npm start

The server will be running at http://localhost:3000 (or your specified port).

API Usage
Generate an Article Plan
Send a POST request to the /api/v1/article/generate endpoint with a JSON body containing the topic.

Endpoint: POST /api/v1/article/generate

Body:

{
  "topic": "The Future of Renewable Energy"
}

Example using curl:

curl -X POST http://localhost:3000/api/v1/article/generate \
-H "Content-Type: application/json" \
-d '{
  "topic": "The Future of Renewable Energy"
}'

A successful request will return a 200 OK status with the generated JSON object.