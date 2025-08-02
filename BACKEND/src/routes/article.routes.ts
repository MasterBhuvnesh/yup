import { Router } from "express";
import { handleGenerateArticle, handleGetAllArticles } from "../controllers/article.controller";
import { verifyAppCheckToken } from "../controllers/appCheck.controller";
const router = Router();

// Define the POST route for generating an article
// POST /api/v1/article/generate
router.post("/generate",verifyAppCheckToken, handleGenerateArticle);

// GET /api/v1/article/all
router.get("/all",verifyAppCheckToken, handleGetAllArticles);



export default router;
