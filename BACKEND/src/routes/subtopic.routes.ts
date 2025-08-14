import { Router } from 'express';
import { handleGetAllTitles } from '../controllers/helper/subtopic.controller';

const router = Router();

// A GET request to the root of this router will trigger the controller
// The full path will be /subtopic
router.get('/subtopic', handleGetAllTitles);

export default router;