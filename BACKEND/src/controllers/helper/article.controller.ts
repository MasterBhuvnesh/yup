import { Request, Response } from 'express';
import db from '../../config/firebase';

export const handleGetArticleById = async (req: Request, res: Response) => {
  try {
    // This is a GET request, so the ID should be in the URL params
    const { docId } = req.body;

    // Fetch the document directly from Firestore
    const docRef = db.collection('articles').doc(docId);
    const docSnap = await docRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    // Get all data from the document
    const fullDocumentData = docSnap.data();

    // Check if the 'article' field exists within the document
    if (!fullDocumentData || !fullDocumentData.article) {
      return res.status(404).json({
        error: 'Article data not found within this document.',
      });
    }

    // Create a new response object with only the id and the article field
    const responseData = {
      id: docSnap.id,
      article: fullDocumentData.article,
    };

    // Send only the extracted article data
    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Error fetching article by ID:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch article.', details: error.message });
  }
};
