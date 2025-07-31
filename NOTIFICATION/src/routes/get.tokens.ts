import { Router, Request, Response } from 'express';

import { authenticate } from '@/middleware/auth';
import { TokenService } from '@/services/token.service';
import { asyncHandler } from '@/utils/errors/error-handler';
import { logger } from '@/utils/logger';
import { ApiResponse } from '@/utils/responses/api-response';

const router = Router();
const tokenService = new TokenService();

/**
 * @route   GET /get-tokens
 * @desc    Get all stored Expo push tokens
 * @access  Private (requires authentication)
 * @returns {ApiResponseFormat<string[]>} Success response with array of tokens
 * @throws  {DatabaseError} When database operation fails
 */
router.get(
  '/get-tokens',
  authenticate,
  asyncHandler(async (_req: Request, res: Response) => {
    logger.log('Retrieving all tokens');
    
    const tokens = await tokenService.getAllTokens();
    
    const response = ApiResponse.success(
      tokens,
      `Retrieved ${tokens.length} tokens`,
      200
    );
    
    res.status(200).json(response);
  }),
);

export default router;
