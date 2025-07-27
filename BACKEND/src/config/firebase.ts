import * as path from 'path';

import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

// Load env variables
dotenv.config();

const serviceAccountPath = "../etc/secrets/key.json";

if (!serviceAccountPath) {
  console.error('SERVICE_ACCOUNT_KEY_PATH is not set in the .env file.');
  process.exit(1);
}

const resolvedPath = path.resolve(__dirname, '..', serviceAccountPath);
const serviceAccount = require(resolvedPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;