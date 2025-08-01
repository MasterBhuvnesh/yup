import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import articleRoutes from './routes/article.routes';
import { config } from './config';
import quizRoutes from './routes/quiz.routes';


// Create the Express application instance
const app = express();

// --- Global Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// --- Health Check Endpoint ---
// A simple endpoint to verify that the server is running.
app.get('/health-check', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// --- API Routes ---
// All article-related routes will be prefixed with /api/v1/article
app.use('/', articleRoutes);

// All quiz-related routes will be prefixed with /api/v1/quiz

app.use('/', quizRoutes);

// --- Cron Job for Health Check ---
// This job runs every minute to ping the health-check endpoint.
// It dynamically uses the correct URL for development or production.
cron.schedule('*/14 * * * *', () => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`[CRON] Running health check at: ${now}`);
  console.log(`[CRON] Pinging URL: ${config.healthCheckUrl}`); // Log the URL being used

  // Use fetch within Node.js (available in Node.js v18+)
  fetch(config.healthCheckUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Health check failed with status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) =>
      console.log(
        `[CRON] Health check successful for ${data.environment} environment.`,
      ),
    )
    .catch((err) => console.error('[CRON] Health check failed:', err.message));
});

export default app;
