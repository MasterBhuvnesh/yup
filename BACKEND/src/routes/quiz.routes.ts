import { Router } from 'express';
import { handleGetQuizByDocId } from '../controllers/helper/quiz.controller';

const router = Router();

// POST /quiz
router.get('/quiz', handleGetQuizByDocId);

export default router;
