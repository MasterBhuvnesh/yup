import cron from "node-cron";
import axios from "axios";
import { logger } from "../utils/logger";

export const startHeartbeatJob = () => {
  if (process.env.NODE_ENV !== "production") {
    logger.log("⏱️ Skipping heartbeat cron: Not in production.");
    return;
  }

  const healthUrl = process.env.HEALTHCHECK_URL;

  if (!healthUrl) {
    logger.error("HEALTHCHECK_URL not set in .env");
    return;
  }

  logger.log("✅ Scheduling heartbeat job every 14 minutes");

  cron.schedule("*/14 * * * *", async () => {
    logger.log("🫀 Running heartbeat check...");
    try {
      const response = await axios.get(healthUrl);
      logger.log(`✅ Healthcheck successful: ${response.status}`);
    } catch (err: any) {
      logger.error("❌ Healthcheck failed:", err.message);
    }
  });
};
