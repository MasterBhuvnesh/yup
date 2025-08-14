import { Router } from "express";
import { handleGetQuizByDocId } from "../controllers/quiz.controller";

const router = Router();


// POST /quiz
router.get("/quiz", handleGetQuizByDocId);

export default router;
