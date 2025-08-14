import { Router } from "express";
import {handleGetFactsByDocId } from "../controllers/facts.controller";

const router = Router();


// POST /quiz
router.get("/facts",handleGetFactsByDocId );

export default router;
