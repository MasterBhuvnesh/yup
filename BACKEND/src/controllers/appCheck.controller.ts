import { Request, Response, NextFunction } from 'express';
// Import the pre-initialized appCheck instance from your config file
import { appCheck } from '../config/firebase';

/**
 * Express middleware to verify a Firebase App Check token on incoming requests.
 * This protects your API from unauthorized clients, bots, and abuse.
 */
export const verifyAppCheckToken = async (req: Request, res: Response, next: NextFunction) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    return res.status(401).send('Unauthorized: App Check token is missing.');
  }

  try {
    // Use the imported appCheck instance to verify the token.
    await appCheck.verifyToken(appCheckToken);
    next();
  } catch (err) {
    res.status(401).send('Unauthorized: Invalid App Check token.');
  }
};