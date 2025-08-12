import { Router } from "express";
import {createFacts } from "../controllers/facts.controller";

const router = Router();


// POST /quiz
router.post("/facts",createFacts );

export default router;
