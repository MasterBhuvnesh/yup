import { Router } from "express";
import { handleGenerateQuiz } from "../controllers/quiz.controller";

const router = Router();


// POST /quiz
router.post("/quiz", handleGenerateQuiz);

export default router;
