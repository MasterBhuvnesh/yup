import { Router } from 'express';
import { handleGenerateAndSave } from '../controllers/main/generation.controller';

const router = Router();

// This single POST route handles the entire generation and saving process
router.post('/generate', handleGenerateAndSave);

export default router;