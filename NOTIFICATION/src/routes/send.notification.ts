import { Router, Request, Response } from "express";
import db from "../config/firebase";
import axios from "axios";
import { logger } from "../utils/logger";
import { authenticate } from "../middleware/auth";

const router = Router();

// Sample 1-liners about Machine Learning
const machineLearningFacts = [
  "Machine learning helps computers learn from data without explicit programming.",
  "Supervised learning requires labeled training data.",
  "Neural networks are inspired by the human brain.",
  "Unsupervised learning finds hidden patterns in unlabeled data.",
  "Reinforcement learning trains agents via reward and punishment.",
];

/**
 * @route   POST /send
 * @desc    Send push notifications to all stored Expo tokens
 * @access  Protected
 */
router.post("/send", authenticate, async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("tokens").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No tokens found" });
    }

    const notifications: any = [];
    const title = "Machine Learning";
    const body =
      machineLearningFacts[
        Math.floor(Math.random() * machineLearningFacts.length)
      ];

    snapshot.forEach((doc) => {
      const token = doc.data().token;
      if (token && token.startsWith("ExponentPushToken")) {
        notifications.push({
          to: token,
          title,
          body,
        });
      }
    });

    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      notifications,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    logger.log("📨 Notifications sent:", response.data);

    return res.status(200).json({
      message: `Notifications sent to ${notifications.length} devices`,
      data: response.data,
    });
  } catch (err: any) {
    logger.error("Failed to send push notifications:", err.message);
    return res.status(500).json({ message: "Failed to send notifications" });
  }
});

export default router;
