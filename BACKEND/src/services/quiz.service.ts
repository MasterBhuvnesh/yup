import { genAI } from '../config';
import { DocumentData } from 'firebase-admin/firestore';
import db  from "../config/firebase"; // Add this line to import the Firestore instance
import { generateArticlePlan } from './article.service';


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


/**
 * Generates a quiz from a provided article object.
 * @param articleJson - The full article object (title, content, sections, etc.).
 * @returns A promise that resolves to the quiz data.
 */
async function generateQuiz(articleJson: any): Promise<any> {
    try {
        // The article generation step has been removed.
        // We now expect the article object to be passed directly.
        if (!articleJson) {
            throw new Error('An article object must be provided to generate a quiz.');
        }

        // =======================================================
        // 📝 STEP 1: FORMAT ARTICLE CONTENT FOR THE QUIZ PROMPT
        // =======================================================
        let contentForPrompt = `Title: ${articleJson.title}\n\nIntroduction: ${articleJson.content}\n\n`;
        articleJson.sections.forEach((section: { title: string; content: string[] }) => {
            contentForPrompt += `Section: ${section.title}\n`;
            contentForPrompt += section.content.join('\n');
            contentForPrompt += '\n\n';
        });

        // =======================================================
        // 🧠 STEP 2: GENERATE THE QUIZ USING THE CONTENT
        // =======================================================
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const fullPrompt = `${PROMPT_TEMPLATE_QUIZ}${contentForPrompt}`;
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse and return the final quiz data
        return JSON.parse(jsonText);

    } catch (error) {
        console.error('Error in quiz generation service:', error);
        throw error;
    }
}

export default generateQuiz;