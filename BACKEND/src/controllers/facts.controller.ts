import { Request, Response } from 'express';
import generateFacts from '../services/facts.service';

export const createFacts = async (req: Request, res: Response) => {
    try {
        const { docId } = req.body;
        if (!docId) {
            return res.status(400).json({ error: 'A "docId" is required in the request body.' });
        }
        const facts = await generateFacts(docId);
        res.status(200).json({ facts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};