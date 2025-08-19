import { genAI } from '../config';

const PROMPT_TEMPLATE_DOMAIN = `
You are an expert topic classifier. Your task is to take a given topic and classify it into a single, broad technical or academic domain.

**Instructions**:
- Respond with ONLY the domain name.
- Use PascalCase (e.g., "WebDevelopment", "DataScience", "History").
- Do not include any other text, explanations, or formatting.

Classify the following topic:
`;

/**
 * Classifies a topic into a single domain name using an AI model.
 * @param topic - The topic to classify.
 * @returns A promise that resolves to the domain name string (e.g., "MachineLearning").
 */
export async function getDomainFromTopic(topic: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const fullPrompt = `${PROMPT_TEMPLATE_DOMAIN}${topic}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        
        // Clean up the response to ensure it's a single, valid collection name
        const domain = response.text().trim().replace(/\s+/g, '');

        if (!domain) {
            // If the AI fails, fall back to a generic collection name
            return 'General';
        }

        return domain;

    } catch (error) {
        console.error('Error classifying domain:', error);
        // Fallback in case of an error
        return 'General';
    }
}