import { genAI } from '../config';

// Define the prompt template as a constant for clarity and reusability
const PROMPT_TEMPLATE = `
You are a specialized AI content generator. Your task is to take a given topic or title and generate a detailed, comprehensive article outline in a specific JSON format.
**IMPORTANT**: You MUST output ONLY the raw JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\`.
Here is the JSON structure to follow:
[
  {
    "id": <Generate a unique ID using the current hour+minute (e.g., 2:59 → 259) and date ( Take the current day and month (e.g., July 20 → 207 for 20/07)). Format: [Time][Date]. Example: 259207.>,
    "title": "<The generated, full title based on the user's input>",
    "excerpt": "<A short, compelling summary of the article (2-3 sentences)>",
    "content": "<A slightly longer introductory paragraph for the article>",
    "author": "<A plausible-sounding but fictional author name>",
    "date": "2025-07-21",
    "imageUrl": "<A relevant, publicly accessible image URL. Use a placeholder service like 'https://source.unsplash.com/1600x900/?<keyword>' where <keyword> is relevant to the topic>",
    "tags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>", "<tag5>", "<tag6>"],
    "sections": [
      {"title": "<Title of the first section>", "content": ["<Point 1>", "<Point 2>"]},
      {"title": "<Title of the second section>", "content": ["<Point 1>", "<Point 2>"]}
    ]
  }
]
Now, generate the complete JSON object for the following topic:
`;

/**
 * Generates an article plan in JSON format using the Gemini API.
 * @param topic - The topic for the article.
 * @returns A parsed JSON object representing the article plan.
 * @throws An error if the API call fails or returns invalid JSON.
 */
export async function generateArticlePlan(topic: string): Promise<any> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    // Construct the full prompt
    const fullPrompt = `${PROMPT_TEMPLATE}${topic}`;

    // Call the AI model
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const jsonText = response
      .text()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Parse and return the JSON content
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error in article generation service:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
}
