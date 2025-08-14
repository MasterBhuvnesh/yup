import { genAI } from '../config';

// The prompt template remains the same
const PROMPT_TEMPLATE_FACTS = `
You are a specialized AI fact generator. Your task is to take a given topic and generate a list of exactly 10 interesting and verifiable facts about it.
**IMPORTANT**: You MUST output ONLY the raw JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\`.
The output should be a JSON array of 10 strings.
[...]
Now, generate the complete JSON array object for the following topic:
`;

/**
 * Generates 10 facts directly from a topic string provided by the user.
 * @param topic - The topic to generate facts about.
 * @returns A promise that resolves to an array of 10 fact strings.
 */
async function generateFacts(topic: string): Promise<string[]> {
    try {
        // This version no longer fetches from Firestore.
        // It uses the user's topic directly.
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const fullPrompt = `${PROMPT_TEMPLATE_FACTS}${topic}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const facts: string[] = JSON.parse(jsonText);
        
        if (!Array.isArray(facts) || facts.length === 0) {
            throw new Error('AI did not return a valid array of facts.');
        }

        return facts;

    } catch (error) {
        console.error('Error in fact generation service:', error);
        throw error;
    }
}

export default generateFacts;