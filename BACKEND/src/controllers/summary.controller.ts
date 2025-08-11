import { Request, Response } from 'express';
import generateSummary from '../services/summary.service'; 

export const createSummary = async (req: Request, res: Response) => {
    try {
        const { docId } = req.params;
        if (!docId) {
            return res.status(400).json({ error: 'Document ID is required.' });
        }
        const summary = await generateSummary(docId);
        res.status(200).json({ summary });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};