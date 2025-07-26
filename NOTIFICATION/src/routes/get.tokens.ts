import { Router, Request, Response } from "express";
import db from "../config/firebase";
import { logger } from "../utils/logger";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @route   GET /get-tokens
 * @desc    Get all stored Expo push tokens
 * @access  Public
 */
router.get(
  "/get-tokens",
  authenticate,
  async (_req: Request, res: Response) => {
    try {
      const tokensSnapshot = await db.collection("tokens").get();
      if (tokensSnapshot.empty) {
        return res.status(200).json([]);
      }

      const tokens: string[] = [];
      tokensSnapshot.forEach((doc) => {
        tokens.push(doc.data().token);
      });

      res.status(200).json(tokens);
    } catch (error) {
      logger.error("Error retrieving tokens:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
