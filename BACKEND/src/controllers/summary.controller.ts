import { Request, Response } from 'express';
import db from '../config/firebase';

/**
 * Handles the request to get a stored summary from a specific article document.
 */
export const handleGetSummaryByDocId = async (req: Request, res: Response) => {
    try {
        // Step 1: Get the document ID from the URL parameters
        const { docId } = req.body;

        // Step 2: Fetch the document from Firestore
        const docRef = db.collection('articles').doc(docId);
        const docSnap = await docRef.get();

        // Step 3: Check if the document exists
        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        // Step 4: Get the data and check specifically for the 'summary' field
        const articleData = docSnap.data();
        if (!articleData || !articleData.summary) {
            return res.status(404).json({
                error: 'A summary has not been generated or saved for this article yet.'
            });
        }

        // Step 5: Return only the summary data
        res.status(200).json({ summary: articleData.summary });

    } catch (error: any) {
        console.error('Error fetching summary by ID:', error);
        res.status(500).json({ error: 'Failed to fetch summary.', details: error.message });
    }
};