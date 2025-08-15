import { Request, Response } from 'express';
import db from '../../config/firebase';

/**
 * Handles the request to get all collections as topics and their document titles as subtopics.
 */
export const handleGetData = async (req: Request, res: Response) => {
    try {
        // Step 1: Get a list of all collection references in your database
        const collectionRefs = await db.listCollections();

        // Step 2: Process each collection in parallel to get its data
        const data = await Promise.all(
            collectionRefs.map(async (collection) => {
                // The topic is the name of the collection (e.g., "articles")
                const topic = collection.id;

                // Fetch all documents from this collection, but only the 'title' field
                const snapshot = await collection.select('title').get();

                // Map the documents to an array of title strings
                const subtopics = snapshot.docs.map(doc => doc.data().title);

                return { topic, subtopics };
            })
        );

        // Step 3: Send the final structured response
        res.status(200).json(data);

    } catch (error: any) {
        console.error('Error fetching structured data:', error);
        res.status(500).json({ error: 'Failed to fetch data.', details: error.message });
    }
};