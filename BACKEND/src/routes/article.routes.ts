import { Router } from "express";
import { handleGenerateArticle } from "../controllers/article.controller";

const router = Router();

// Define the POST route for generating an article
// POST /api/v1/article/generate
router.post("/generate", handleGenerateArticle);

export default router;
