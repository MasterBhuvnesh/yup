import { Router, Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

import db from '@/config/firebase';
import { authenticate } from '@/middleware/auth';
import { logger } from '@/utils/logger';
import { registerTokenSchema } from '@/validators/register.token.validator';
import Joi from 'joi';

const router = Router();

const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

/**
 * @route   POST /register-token
 * @desc    Register an Expo push token
 * @access  Public
 */
router.post(
  '/register-token',
  authenticate,
  validate(registerTokenSchema),
  async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const tokenRef = db.collection('tokens').doc(token);
      await tokenRef.set({
        token: token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.log(`Successfully stored token: ${token}`);
      res.status(201).json({ message: 'Token stored successfully' });
    } catch (error) {
      logger.error('Error storing token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

export default router;
