import { Request, Response } from 'express';
import db from '../../config/firebase';

/**
 * Handles the request to get a specific document from a specific collection.
 */
export const handleGetContentById = async (req: Request, res: Response) => {
    try {
        // Get both the collection name and the document ID from the URL
        const { collectionName, docId } = req.params;

        if (!collectionName || !docId) {
            return res.status(400).json({ error: 'Collection name and document ID are required.' });
        }

        // Fetch the document directly from the specified collection
        const docRef = db.collection(collectionName).doc(docId);
        const docSnap = await docRef.get();

        // Check if the document exists
        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Content not found.' });
        }

        // Send the response with the document's ID and data
        res.status(200).json({
            id: docSnap.id,
            ...docSnap.data()
        });

    } catch (error: any) {
        console.error('Error fetching content by ID:', error);
        res.status(500).json({ error: 'Failed to fetch content.', details: error.message });
    }
};