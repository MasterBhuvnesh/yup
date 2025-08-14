import { Router } from 'express';
import { handleGenerateAndSaveAll } from '../controllers/content.controller';

const router = Router();

// This single endpoint generates and saves everything
router.post('/content', handleGenerateAndSaveAll);

// You can add other routes here as well
export default router;