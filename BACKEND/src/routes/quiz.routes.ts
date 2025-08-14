import { Router } from "express";
import { handleGenerateQuiz } from "../controllers/quiz.controller";

const router = Router();


// POST /quiz
router.get("/quiz", handleGenerateQuiz);

export default router;
