import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      score: {
        type: "integer",
      },
      feedback: {
        type: "string",
      },
      issuesOrImprovement: {
        type: "string",
      },
    },
  },
};

export async function POST(request) {
  try {
    const { taskDescription, userResponse } = await request.json();

    const prompt = `
    Context for Evaluation:
    The following task is part of a learning or assessment module designed to help users improve in specific technical or professional skills. When evaluating the user's response, consider the following aspects:
    If task Description expects code then evaluate on the basis of code. If it expects wriiten explanation then evaluate on the basis of understanding and core concepts.
    Completeness: Does the response cover all required parts of the task as described in the task description?
    Accuracy: Are the details provided correct, technically sound, and relevant to the task requirements?
    Clarity: Is the response clear, concise, and easy to understand, demonstrating a good grasp of the subject matter?
    Quality of Code (if applicable): If this is a code-related task, check for logical correctness, readability, adherence to best practices, and whether it fulfills the task's intent.

    Task Description:
    "${taskDescription}"

    User Response:
    "${userResponse}"

    Evaluation Request:
    Please analyze the user’s response in light of the task description and context above, and provide the following:

    Score (out of 100): Rate the response based on completeness, accuracy, clarity, and, if applicable, code quality.

    Issues or Mistakes: Identify any inaccuracies, gaps, or areas needing improvement. If the response is complete and accurate, acknowledge this with positive feedback.

    Suggestions for Improvement: Recommend specific improvements for clarity, depth, or correctness. If the response is already of high quality, provide encouraging feedback to reinforce good practices.
    `;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage("");

    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Error generating evaluation:", error);
    return NextResponse.json({ error: "Error generating evaluation" }, { status: 500 });
  }
}
