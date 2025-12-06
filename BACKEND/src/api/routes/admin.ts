import { Router } from 'express'
import * as AdminController from '../controllers/admin.controller'
import {
  clerkAuthMiddleware,
  requireAuth,
  requireAdmin,
} from '../../middleware/auth'

const router = Router()

// Protect all routes in this file with the admin middleware
router.use(clerkAuthMiddleware, requireAuth, requireAdmin)

/**
 * @route POST /admin/documents
 * @description Create a new document.
 * @access Admin
 */
router.post('/documents', AdminController.createDocument)

/**
 * @route PUT /admin/documents/:id
 * @description Update a document by its ID.
 * @access Admin
 */
router.put('/documents/:id', AdminController.updateDocument)

/**
 * @route DELETE /admin/documents/:id
 * @description Delete a document by its ID.
 * @access Admin
 */
router.delete('/documents/:id', AdminController.deleteDocument)

export default router
