import { Request, Response } from 'express';
import db from '../config/firebase';

export const handleGetArticleById = async (req: Request, res: Response) => {
    try {
       
        const { docId } = req.body;

        // Step 2: Fetch the document directly from Firestore
        const docRef = db.collection('articles').doc(docId);
        const docSnap = await docRef.get();

        // Step 3: Check if the document exists
        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        // Step 4: Combine the document ID with its data and send the response
        const articleData = {
            id: docSnap.id,
            ...docSnap.data()
        };

        res.status(200).json(articleData);

    } catch (error: any) {
        console.error('Error fetching article by ID:', error);
        res.status(500).json({ error: 'Failed to fetch article.', details: error.message });
    }
};