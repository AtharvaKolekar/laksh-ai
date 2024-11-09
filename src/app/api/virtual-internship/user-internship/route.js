import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Function to generate internship details
const generateInternship = async (topic, months, apiKey) => {
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
        CompanyName: { type: "string" },
        companyDescription: { type: "string" },
        "YourRole": { type: "string" },
        phases: {
          type: "array",
          items: {
            type: "object",
            properties: {
              task: { type: "string" },
              guidance: { type: "string" },
              steps: {
                type: "array",
                items: { type: "string" },
              },
              topicsCovered: { type: "string" },
              deadline: { type: "string" },
            },
          },
        },
      },
    },
  };
  const date = new Date();
  // Start the chat session with the AI model
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a complex, real-world ${topic} project, which will be completed by the user within ${months} month. The user is working as some random intern role and some random company. Take name according to you and the role which best fits. And suggest projects which are actually given to interns in real world. The project should simulate a virtual internship experience where the user can work on a task management application with clear, achievable deadlines and tasks. The project should be divided into phases with tasks that the user can complete. Today's date is ${date}, so give the dates accordingly.`,
          },
        ],
      },
    ],
  });

  // Get the result from the AI response
  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  return result.response.text(); // Return the generated internship details
};

export const POST = async (req) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = new URL(req.url, `http://${req.headers.host}`); // Construct a full URL
    const field = url.searchParams.get('field');
    const duration = url.searchParams.get('duration');
    console.log(req.body);
    console.log(field, duration);
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    let alreadyHasInternship = false; // Replace with actual check, e.g., database query
    let internship = null;

    // Check if the user already has an internship
    if (alreadyHasInternship) {
      return NextResponse.json({
        status: 400,
        message: "User already has an ongoing internship.",
      });
    }

    // Parameters for generating internship


    // Generate internship project
    internship = await generateInternship(field, duration, apiKey);

    // Send the response after internship is generated
    return NextResponse.json({
      status: 200,
      message: "New Internship generated successfully",
      internship,
    });
  } catch (error) {
    console.error("Error occurred:", error);

    return NextResponse.json({
      status: 500,
      message: "An error occurred while generating the internship.",
    });
  }
};
