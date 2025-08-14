import { Router } from "express";
import { handleGetArticleById } from "../controllers/article.controller";
const router = Router();

// Define the POST route for generating an article
// POST /api/v1/article/generate
router.get("/generate",handleGetArticleById);

// GET /api/v1/article/all
// router.get("/all", handleGetAllArticles);



export default router;
