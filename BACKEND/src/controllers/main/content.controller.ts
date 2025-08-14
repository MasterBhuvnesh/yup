import { Request, Response } from 'express';
import db from '../../config/firebase';
import { generateArticlePlan } from '../../services/article.service';
import generateFacts from '../../services/facts.service';
import generateQuiz from '../../services/quiz.service';
import generateSummary from '../../services/summary.service';

export const handleGenerateAndSaveAll = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'A "topic" is required.' });
    }

    console.log(`Starting full content package for topic: ${topic}`);

    // --- PHASE 1: Generate article & facts in parallel (they only need the topic) ---
    const [articleResult, facts] = await Promise.all([
      generateArticlePlan(topic),
      generateFacts(topic),
    ]);

    const article = articleResult[0]; // The article service returns an array
    console.log('-> Article and facts generated.');

    // --- PHASE 2: Generate quiz & summary in parallel (they need the article content) ---
    const [quiz, summary] = await Promise.all([
      generateQuiz(article),
      generateSummary(article),
    ]);
    console.log('-> Quiz and summary generated.');

    // --- PHASE 3: Combine everything and save to Firestore ---
    const newDocumentPayload = {
      title: article.title,
      createdAt: new Date().toISOString(),
      article,
      facts,
      quiz,
      summary,
    };

    const docRef = await db.collection('articles').add(newDocumentPayload);
    console.log(`-> Full package saved to new doc ID: ${docRef.id}`);

    // --- PHASE 4: Respond with the newly created data ---
    res.status(201).json({
      id: docRef.id,
      ...newDocumentPayload,
    });
  } catch (error: any) {
    console.error('Error in "generate and save all" flow:', error);
    res
      .status(500)
      .json({
        error: 'Failed to generate all content.',
        details: error.message,
      });
  }
};
