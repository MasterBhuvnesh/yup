import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

// Load env variables
dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;

if (!serviceAccountPath) {
  console.error("SERVICE_ACCOUNT_KEY_PATH is not set in the .env file.");
  process.exit(1);
}

const resolvedPath = path.resolve(__dirname, "..", serviceAccountPath);
const serviceAccount = require(resolvedPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;
