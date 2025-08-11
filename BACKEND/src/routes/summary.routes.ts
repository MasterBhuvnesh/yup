import { Router } from "express";
import { createSummary } from "../controllers/summary.controller";

const router = Router();


// POST /summary
router.post('/articles/:docId/summary', createSummary);

export default router;
