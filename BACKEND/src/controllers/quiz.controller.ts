import { Request, Response } from 'express';
import generateQuiz  from '../services/quiz.service'; // Assuming your service file is here

/**
 * Handles the request to generate a quiz from an article ID.
 * @param req - The Express request object. Expects { docId: string } in the body.
 * @param res - The Express response object.
 */
export async function handleGenerateQuiz(req: Request, res: Response) {
  try {
    // Extract the document ID from the request body
    const { docId } = req.body;

    // Validate that the docId was provided
    if (!docId) {
      return res.status(400).json({ error: 'Document ID (docId) is required.' });
    }

    // Call the service function to generate the quiz
    const quizData = await generateQuiz(docId);

    // Send the successful response
    res.status(200).json(quizData);
  } catch (error: any) {
    // Log the error and send a generic server error response
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz.', details: error.message });
  }
}