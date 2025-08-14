import { Router } from 'express';
import { handleGetFactsByDocId } from '../controllers/helper/facts.controller';

const router = Router();

// POST /quiz
router.get('/facts', handleGetFactsByDocId);

export default router;
