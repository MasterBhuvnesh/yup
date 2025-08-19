import { Router } from 'express';
import { handleGetContentById } from '../controllers/main/content.controller';

const router = Router();

// This route uses two parameters: the collection and the document ID
router.get('/:collectionName/:docId', handleGetContentById);

export default router;