import { Request, Response } from 'express';
import db from '../config/firebase';

/**
 * Handles the request to get stored facts from a specific article document.
 */
export const handleGetFactsByDocId = async (req: Request, res: Response) => {
    try {
        
        const { docId } = req.body;

        // Step 2: Fetch the document from Firestore
        const docRef = db.collection('articles').doc(docId);
        const docSnap = await docRef.get();

        // Step 3: Check if the document exists
        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        // Step 4: Get the document's data and check for the 'facts' field
        const articleData = docSnap.data();
        if (!articleData || !articleData.facts) {
            return res.status(404).json({
                error: 'Facts have not been generated or saved for this article yet.'
            });
        }

        // Step 5: Return only the facts
        res.status(200).json({ facts: articleData.facts });

    } catch (error: any) {
        console.error('Error fetching facts by ID:', error);
        res.status(500).json({ error: 'Failed to fetch facts.', details: error.message });
    }
};