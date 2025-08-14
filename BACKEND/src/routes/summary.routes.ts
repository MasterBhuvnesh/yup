import { Router } from "express";
import { handleGetSummaryByDocId } from "../controllers/summary.controller";

const router = Router();


// POST /summary
router.get('/summary', handleGetSummaryByDocId);

export default router;
