import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import contentRoutes from './routes/content.routes';
import articleRoutes from './routes/article.routes';
import { config } from './config';
import quizRoutes from './routes/quiz.routes';
import summaryRoutes from './routes/summary.routes';
import factsRoutes from './routes/facts.routes';
import dataRoutes from './routes/data.routes';
import generationRoutes from './routes/generation.routes';


dotenv.config();
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
// All generation-related routes will be prefixed with /generation
app.use('/', generationRoutes);

app.use('/', contentRoutes);

// --- API Routes ---
// All article-related routes will be prefixed with /article
app.use('/', articleRoutes);

// All quiz-related routes will be prefixed with /quiz

app.use('/', quizRoutes);
// All summary-related routes will be prefixed with /summary
app.use('/',summaryRoutes);
//All facts-related routes will be prefixed with /facts
app.use('/', factsRoutes);

// All data-related routes will be prefixed with /data
app.use('/', dataRoutes);


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
