import { genAI } from '../config';
// No longer need to import db from firebase

// Define the prompt template for generating a summary
const PROMPT_TEMPLATE_SUMMARY = `
You are an expert AI content summarizer. Your task is to take the following article content and generate a concise, easy-to-read summary.

**Instructions**:
- The summary should be approximately 3-4 sentences long.
- It must capture the main points, key arguments, and primary conclusions of the article.
- The output must be a single block of plain text. Do NOT use markdown, titles, or JSON formatting.

Now, generate a summary for the following article content:
`;

/**
 * Generates a summary from a provided article object.
 * @param articleJson - The full article object (title, content, sections, etc.).
 * @returns A string containing the generated summary.
 * @throws An error if the generation fails.
 */
async function generateSummary(articleJson: any): Promise<string> {
    try {
        // The database fetching step has been removed.
        if (!articleJson) {
            throw new Error('An article object must be provided to generate a summary.');
        }

        // Format the article content for the AI prompt
        let contentForPrompt = `Title: ${articleJson.title}\n\nIntroduction: ${articleJson.content}\n\n`;
        articleJson.sections.forEach((section: { title: string; content: string[] }) => {
            contentForPrompt += `Section: ${section.title}\n`;
            contentForPrompt += section.content.join('\n');
            contentForPrompt += '\n\n';
        });

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        // Construct the full prompt
        const fullPrompt = `${PROMPT_TEMPLATE_SUMMARY}${contentForPrompt}`;

        // Call the AI model and return the text summary
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        return response.text().trim();

    } catch (error) {
        console.error('Error in summary generation service:', error);
        throw error;
    }
}

export default generateSummary;