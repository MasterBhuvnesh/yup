import { genAI } from '../config';
import db from "../config/firebase"; // Make sure to import Firestore

// The prompt template remains the same
const PROMPT_TEMPLATE_FACTS = `
You are a specialized AI fact generator. Your task is to take a given topic and generate a list of exactly 10 interesting and verifiable facts about it.
**IMPORTANT**: You MUST output ONLY the raw JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\`.
The output should be a JSON array of 10 strings.
Here is the JSON structure to follow for the array:
[
  "<Fact 1>",
  "<Fact 2>",
  "<Fact 3>",
  "<Fact 4>",
  "<Fact 5>",
  "<Fact 6>",
  "<Fact 7>",
  "<Fact 8>",
  "<Fact 9>",
  "<Fact 10>"
]
Now, generate the complete JSON array object for the following topic:
`;

/**
 * Generates 10 facts based on the title of an article from Firestore.
 * @param docId - The ID of the article document in Firestore.
 * @returns A promise that resolves to an array of 10 fact strings.
 * @throws An error if the generation fails or the document is not found.
 */
async function generateFacts(docId: string): Promise<string[]> {
    try {
        // Step 1: Fetch the article from Firestore
        const docRef = db.collection("articles").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error(`Article with ID "${docId}" not found.`);
        }

        // Step 2: Extract the article's title to use as the topic
        const articleJson = docSnap.data()?.Data[0];
        if (!articleJson || !articleJson.title) {
            throw new Error(`Could not find a title in document "${docId}".`);
        }
        const topic = articleJson.title;

        // Step 3: Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        // Step 4: Construct the full prompt using the extracted topic
        const fullPrompt = `${PROMPT_TEMPLATE_FACTS}${topic}`;

        // Step 5: Call the AI model
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        // Step 6: Parse and return the JSON content
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