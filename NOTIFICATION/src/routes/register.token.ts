import { Router, Request, Response } from "express";
import db from "../config/firebase";
import * as admin from "firebase-admin";
import { logger } from "../utils/logger";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @route   POST /register-token
 * @desc    Register an Expo push token
 * @access  Public
 */
router.post(
  "/register-token",
  authenticate,
  async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      const tokenRef = db.collection("tokens").doc(token);
      await tokenRef.set({
        token: token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.log(`Successfully stored token: ${token}`);
      res.status(201).json({ message: "Token stored successfully" });
    } catch (error) {
      logger.error("Error storing token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
