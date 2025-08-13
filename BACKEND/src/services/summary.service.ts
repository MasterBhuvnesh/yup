import { genAI } from '../config';
import db from '../config/firebase';


// Define the prompt template for generating a summary
const PROMPT_TEMPLATE_SUMMARY = `
You are an expert AI content summarizer. Your task is to take the following article content and generate a concise, easy-to-read summary.

**Instructions**:
- The summary should be approximately 150-200 words.
- It must capture the main points, key arguments, and primary conclusions of the article.
- The output must be a single block of plain text. Do NOT use markdown, titles, or JSON formatting.

Now, generate a summary for the following article content:
`;

/**
 * Generates a summary for a given article from Firestore.
 * @param docId - The ID of the article document in Firestore.
 * @returns A string containing the generated summary.
 * @throws An error if the article is not found or the generation fails.
 */
async function generateSummary(docId: string): Promise<string> {
    const cacheKey = `summary:${docId}`;
    try {
        // 1. Fetch the article from Firestore (same as quiz route)
        const docRef = db.collection("articles").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error(`Article with ID "${docId}" not found.`);
        }

        // 2. Extract and format the content for the prompt (same as quiz route)
        // The data is stored in the 'Data' field and is an array.
        const articleJson = docSnap.data()?.Data[0];
        if (!articleJson) {
            throw new Error(`Could not find article content in document "${docId}".`);
        }

        let contentForPrompt = `Title: ${articleJson.title}\n\nIntroduction: ${articleJson.content}\n\n`;
        articleJson.sections.forEach((section: { title: string; content: string[] }) => {
            contentForPrompt += `Section: ${section.title}\n`;
            contentForPrompt += section.content.join('\n');
            contentForPrompt += '\n\n';
        });

        // 3. Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        // 4. Construct the full prompt with the new summary template
        const fullPrompt = `${PROMPT_TEMPLATE_SUMMARY}${contentForPrompt}`;

        // 5. Call the AI model
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const summaryText = response.text().trim();

        // 6. Return the plain text summary
        return summaryText;

    } catch (error) {
        console.error('Error in summary generation service:', error);
        // Re-throw the error to be handled by the controller
        throw error;
    }
}

export default generateSummary;