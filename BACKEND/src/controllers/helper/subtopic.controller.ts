import { Request, Response } from 'express';
import db from '../../config/firebase';

/**
 * Handles the request to get all article titles from the 'articles' collection.
 */
export const handleGetAllTitles = async (req: Request, res: Response) => {
    try {
        // Step 1: Fetch from Firestore (efficiently)
        // Use .select('title') to only retrieve the title field from each document
        const snapshot = await db.collection('articles').select('title').get();

        // Step 2: Map the results to an array of strings
        const titles = snapshot.docs.map(doc => doc.data().title);

        // Step 3: Send the response
        res.status(200).json({ titles });

    } catch (error: any) {
        console.error('Error fetching all titles:', error);
        res.status(500).json({ error: 'Failed to fetch titles.', details: error.message });
    }
};