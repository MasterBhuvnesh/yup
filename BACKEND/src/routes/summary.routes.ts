import { Router } from "express";
import { createSummary } from "../controllers/summary.controller";

const router = Router();


// POST /summary
router.post('/summary', createSummary);

export default router;
