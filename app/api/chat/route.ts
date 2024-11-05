import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { content } = await req.json();
  const prompt = `Explain the code below in plain English: \n\n${content}`;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const text = response.text();

  return Response.json({ text });
}
