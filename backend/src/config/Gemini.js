import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export const analyzeAndGiveData = async (speech_text, format) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
        contents: [
            {
                parts: [
                    {
                        text: `You are a JSON generator. 
                            Given this transcript, respond with ONLY a single valid JSON object. 
                            - Do NOT include any extra text, markdown, comments, or explanations. 
                            - Response MUST start with '{' and end with '}'. 
                            Transcript:${speech_text}
                            Format:${format}`
                    }
                ]
            }
        ]
    });
    return result;
};