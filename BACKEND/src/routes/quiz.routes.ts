import { Router } from "express";
import { handleGenerateQuiz } from "../controllers/quiz.controller";
import { verifyAppCheckToken } from "../controllers/appCheck.controller";
const router = Router();


// POST /quiz
router.post("/quiz",verifyAppCheckToken, handleGenerateQuiz);

export default router;
