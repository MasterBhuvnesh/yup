import express, { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

// Configure dotenv to load environment variables
dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;

if (!serviceAccountPath) {
  console.error("SERVICE_ACCOUNT_KEY_PATH is not set in the .env file.");
  process.exit(1);
}

// Resolve the path to the service account key
const resolvedPath = path.resolve(__dirname, serviceAccountPath);
const serviceAccount = require(resolvedPath);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * @route   POST /register-token
 * @desc    Register an Expo push token
 * @access  Public
 */
app.post("/register-token", async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // The token itself can be used as the document ID to avoid duplicates
    const tokenRef = db.collection("tokens").doc(token);
    await tokenRef.set({
      token: token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // console.log(`Successfully stored token: ${token}`); // Uncomment for debugging
    res.status(201).json({ message: "Token stored successfully" });
  } catch (error) {
    // console.error("Error storing token:", error); // Uncomment for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   GET /get-tokens
 * @desc    Get all stored Expo push tokens
 * @access  Public
 */
app.get("/get-tokens", async (req: Request, res: Response) => {
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
    console.error("Error retrieving tokens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
