// /pages/api/generateTask.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
      response: {
        type: "object",
        properties: {
          task: { type: "string" },
          taskType: {
            type: "string",
            enum: [
              "CODE_SUBMISSION",
              "WRITTEN_EXPLANATION",
              "SCREENSHOT_UPLOAD",
              "CODE_ANALYSIS_OUTPUT",
            ],
          },
        },
      },
    },
  },
};

export async function POST(req, res) {


  try {
    const { phaseData } = await req.json();

    if (!phaseData) {
      return NextResponse.json({
        status:400,
        message:"No PhaseData sent!"
      })
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are assisting in verifying the completion of tasks within a remote internship project. 
              Each internship phase has unique requirements and tasks. Based on the JSON data provided, 
              please generate a task for the user to verify their work on the specified phase. 

              Each task should:
              1. Align with the \`task\` description provided in the phase data.
              2. Be achievable with inputs from the user that can be evaluated by AI, based on the skills and goals of the phase.
              3. Indicate a \`taskType\` that falls into one of these categories:
                 - **Code Submission**: User submits a code snippet or file.
                 - **Written Explanation**: User describes the task or process in text.
                
         

              Use the provided JSON data to create relevant tasks for the specific phase, ensuring the input type is suitable for AI evaluation.

              Sample JSON data:
              ${JSON.stringify(phaseData)}

              Expected output format:
              {
                "task": "Task description for the user to complete",
                "taskType": "One of: CODE_SUBMISSION, WRITTEN_EXPLANATION"
              }
              `,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Generate a task for the provided phase data.");
    const response = result.response.text();
    console.log(result.response.text());

  return NextResponse.json({
        status:200,
        response
    })
  } catch (error) {
    console.error("Error generating task:", error);
   return NextResponse.json({
        status:500,
        error
    })
  }
}
