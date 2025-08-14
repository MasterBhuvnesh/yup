import { Request, Response } from 'express';
import db from '../../config/firebase';

/**
 * Handles the request to get a stored quiz from a specific article document.
 */
export const handleGetQuizByDocId = async (req: Request, res: Response) => {
  try {
    // For a GET request, the ID comes from the URL parameters
    const { docId } = req.body;

    // Fetch the document from Firestore
    const docRef = db.collection('articles').doc(docId);
    const docSnap = await docRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    // Get the data and check specifically for the 'quiz' field
    const articleData = docSnap.data();
    if (!articleData || !articleData.quiz) {
      return res.status(404).json({
        error: 'A quiz has not been generated or saved for this article yet.',
      });
    }

    // Return only the quiz data
    res.status(200).json({ quiz: articleData.quiz });
  } catch (error: any) {
    console.error('Error fetching quiz by ID:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch quiz.', details: error.message });
  }
};
