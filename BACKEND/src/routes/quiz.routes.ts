import { Router } from "express";
import { handleGenerateQuiz } from "../controllers/quiz.controller";

const router = Router();


// POST /api/v1/quiz/generate
router.post("/generate", handleGenerateQuiz);

export default router;
