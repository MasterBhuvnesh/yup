import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from the .env file
dotenv.config();

// Validate that the required environment variables are set
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in the .env file.");
  process.exit(1); // Exit the process with an error code
}

// Determine the base URL based on the environment
const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction
  ? process.env.API_URL
  : `http://localhost:${process.env.PORT || 3000}`;

if (isProduction && !process.env.API_URL) {
  console.error(
    "FATAL ERROR: API_URL is not defined in the .env file for production environment."
  );
  process.exit(1);
}

// Export a configuration object
export const config = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  nodeEnv: process.env.NODE_ENV || "development",
  // Construct the full health check URL
  healthCheckUrl: `${baseUrl}/health-check`,
};

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(config.geminiApiKey);
