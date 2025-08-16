import * as path from 'path';
import { getAppCheck } from 'firebase-admin/app-check';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';


// Load env variables
dotenv.config();
let serviceAccount: any;

if (process.env.NODE_ENV === "development") {
  const serviceAccountPath = "../etc/secrets/key.json";
  const resolvedPath = path.resolve(__dirname, '..', serviceAccountPath);
  serviceAccount = require(resolvedPath);
} else if (process.env.NODE_ENV === "production") {
  serviceAccount = require('/etc/secrets/key.json');
} else {
  console.error('NODE_ENV must be set to "development" or "production".');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;
export const appCheck = getAppCheck();