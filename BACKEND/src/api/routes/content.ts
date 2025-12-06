import { Router } from 'express'
import * as ContentController from '../controllers/content.controller'
import { clerkAuthMiddleware, requireAuth } from '../../middleware/auth'

const router = Router()

/**
 * @route GET /content
 * @description Get a paginated list of documents.
 * @access Public
 */
router.get('/', ContentController.getPaginatedContent)

/**
 * @route GET /content/:id
 * @description Get a single document by its ID.
 * @access Authenticated
 */
router.get(
  '/:id',
  clerkAuthMiddleware,
  requireAuth,
  ContentController.getDocumentById
)

export default router
