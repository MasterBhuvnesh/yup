import { genAI } from '../config';
import { DocumentData } from 'firebase-admin/firestore';
import db  from "../config/firebase"; // Add this line to import the Firestore instance


const PROMPT_TEMPLATE_QUIZ = `
You are a specialized AI quiz generator. Your task is to take a given article content and generate a quiz with 10 multiple-choice questions based on it.
**IMPORTANT**: You MUST output ONLY the raw JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\`.
The quiz should have exactly 10 questions. Each question must have 4 options.
Here is the JSON structure to follow for the array of questions:
[
  {
    "question": "<The question text>",
    "options": [
      "<Option 1>",
      "<Option 2>",
      "<Option 3>",
      "<Option 4>"
    ],
    "correct_answer": "<The correct option text>"
  },
  {
    "question": "<The next question text>",
    "options": [
      "<Option 1>",
      "<Option 2>",
      "<Option 3>",
      "<Option 4>"
    ],
    "correct_answer": "<The correct option text>"
  }
]
Now, generate the complete JSON array object for the following article content:
`;


async function generateQuiz(docId: string): Promise<any> {
  const cacheKey = `quiz:${docId}`;
    try {
        // 1. Fetch the article from Firestore
        const docRef = db.collection("articles").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error(`Article with ID "${docId}" not found.`);
        }

        // 2. Extract and format the content for the prompt
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

        // 4. Construct the full prompt
        const fullPrompt = `${PROMPT_TEMPLATE_QUIZ}${contentForPrompt}`;

        // 5. Call the AI model
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        // 6. Parse and return the JSON content
        return JSON.parse(jsonText);

    } catch (error) {
        console.error('Error in quiz generation service:', error);
        // Re-throw the error to be handled by the controller
        throw error;
    }
}

export default generateQuiz;