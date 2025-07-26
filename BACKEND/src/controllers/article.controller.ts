import { Request, Response } from 'express';
import { generateArticlePlan } from '../services/article.service';
import { saveArticleToFirestore } from '../services/firebase.service';

/**
 * Handles the request to generate an article.
 * It validates the input and uses the article service to get the data.
 */
export async function handleGenerateArticle(req: Request, res: Response) {
  try {
    const { topic } = req.body;

    // Input validation
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        error: 'A non-empty "topic" string is required in the request body.',
      });
    }

    console.log(`Controller received request for topic: ${topic}`);

    // Call the service to perform the core logic
    const articleJson = await generateArticlePlan(topic);

    // Save to Firestore
    const title = articleJson[0]?.title || topic;
    await saveArticleToFirestore(title, articleJson);

    // Send a successful response
    res.status(200).json(articleJson);
  } catch (error) {
    console.error('Error in article controller:', error);

    // Handle specific errors, like JSON parsing issues
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error:
          'Failed to parse JSON from the AI model. The model may have returned an invalid format.',
      });
    }

    // Send a generic server error response
    res.status(500).json({
      error: 'An internal server error occurred while generating the article.',
    });
  }
}

/**
 * Handles the request to get all articles from Firestore.
 */
export async function handleGetAllArticles(req: Request, res: Response) {
  try {
    // Import db directly to avoid circular dependency
    const db = (await import('../config/firebase')).default;
    const snapshot = await db.collection('articles').get();
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      error: 'Failed to fetch articles from Firestore.',
    });
  }
}
