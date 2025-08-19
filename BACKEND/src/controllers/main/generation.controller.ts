import { Request, Response } from 'express';
import db from '../../config/firebase';
import { getDomainFromTopic } from '../../services/domain.service'; // 👈 Import the new service
import { generateArticlePlan } from '../../services/article.service';
import generateFacts from '../../services/facts.service';
import generateQuiz from '../../services/quiz.service';
import  generateSummary  from '../../services/summary.service';

export const handleGenerateAndSave = async (req: Request, res: Response) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'A "topic" is required.' });
        }

        // --- Step 1: Classify the topic to get the domain ---
        const domain = await getDomainFromTopic(topic);
        console.log(`Topic "${topic}" classified into domain: "${domain}"`);

        // --- Step 2: Generate all content (as before) ---
        const [articleResult, facts] = await Promise.all([
            generateArticlePlan(topic),
            generateFacts(topic)
        ]);
        const article = articleResult[0];
        const [quiz, summary] = await Promise.all([
            generateQuiz(article),
            generateSummary(article)
        ]);

        // --- Step 3: Save to Firestore using the DYNAMIC collection name ---
        const newDocumentPayload = {
            title: article.title,
            createdAt: new Date().toISOString(),
            article,
            facts,
            quiz,
            summary
        };

        // The collection name is now the 'domain' variable
        const docRef = await db.collection(domain).add(newDocumentPayload);
        console.log(`Content saved to collection "${domain}" with ID: ${docRef.id}`);

        // --- Step 4: Respond with the saved data ---
        res.status(201).json({ id: docRef.id, ...newDocumentPayload });

    } catch (error: any) {
        console.error('Error in the generate-and-save flow:', error);
        res.status(500).json({ error: 'Failed to complete the operation.', details: error.message });
    }
};