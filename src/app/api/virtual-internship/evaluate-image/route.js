// src/app/api/virtual-internship/generate-task/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { IncomingForm } from "formidable";
import { Readable } from 'stream';

import path from "path";

// Set up Gemini and File Manager instances
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export const config = {
  api: {
    bodyParser: false,  // This ensures that Next.js doesn't try to parse the request body itself
  },
};

// Function to handle file upload using formidable
const uploadFile = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.uploadDir = "./temp";
    form.keepExtensions = true;

    const stream = Readable.from(req.body); // Convert the body to a readable stream

    form.parse(stream, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return reject(err);
      }
      const uploadedFilePath = files?.file?.filepath;
      if (!uploadedFilePath) {
        return reject("No file uploaded.");
      }
      resolve({ filePath: uploadedFilePath, mimeType: files.file.mimetype });
    });
  });
};

export async function POST(req) {
  try {
    // Step 1: Get the uploaded file
    const { filePath, mimeType } = await uploadFile(req);

    // Step 2: Upload the file to Google File Manager for evaluation
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: path.basename(filePath),
    });

    const file = uploadResult.file;
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Configuration for Gemini's response
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          score: { type: "integer" },
          feedback: { type: "string" },
          issuesOrImprovement: { type: "string" },
        },
      },
    };

    // Step 3: Send the image for evaluation with instructions
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: file.mimeType,
                fileUri: file.uri,
              },
            },
            {
              text: `
                  You are evaluating an image submitted as part of a virtual internship project. 
                  Please assess this image based on the following evaluation criteria, each with detailed instructions:
                  
                  **Evaluation Criteria:**
                  
                  1. **Completeness**: 
                     - Check whether the image fully meets the project requirements and guidelines. 
                     - Ensure all expected elements, components, or sections specified in the project description are present.
                     - Identify any missing elements and specify which parts are incomplete if applicable.
                  
                  2. **Accuracy**:
                     - Verify that the contents in the image match the expected output or design template, if available.
                     - Assess if labels, icons, and other components are correctly applied as per instructions.
                     - Highlight any discrepancies between the image content and the project guidelines.
                  
                  3. **Clarity**:
                     - Evaluate if the image is organized logically, with clear sections, labels, or labels where needed.
                     - Assess if the layout is readable and does not contain overlapping, unclear, or confusing elements.
                     - Point out any parts that could be organized better for clarity.
                  
                  4. **Design Standards**:
                     - Check if the image follows visual design principles such as alignment, spacing, and color consistency.
                     - Identify if the design adheres to the specified theme or branding (e.g., color schemes, font sizes).
                     - Suggest improvements if any design elements are inconsistent or visually jarring.
                  
                  **Output Requirements:**
                  Provide a JSON response with the following fields:
                  
                  - **Score**: An integer between 0 and 100, representing the overall quality of the submission.
                  - **Feedback**: A summary of strengths observed in the image, highlighting areas that meet the criteria well.
                  - **Issues or Mistakes**: A list of identified problems with specific references to criteria (e.g., missing elements under Completeness, alignment issues under Design Standards).
                  - **Suggestions for Improvement**: Detailed recommendations for enhancing the image, organized by each criterion.
                  
                  Be as specific as possible in your feedback. For example, if the image lacks clarity in a particular area, indicate the exact part of the image or section that needs improvement.
               `,
            },
          ],
        },
      ],
    });

    // Step 4: Evaluate the uploaded image with Gemini AI
    const evaluationResult = await chatSession.sendMessage("Evaluate the uploaded image");

    // Clean up uploaded files after evaluation
    fs.unlinkSync(filePath);

    // Return the evaluation result
    return NextResponse.json({
      message: "Image evaluated successfully",
      result: evaluationResult.response,
      status:200
    });
  } catch (error) {
    console.error("Error in evaluating image:", error);
    return NextResponse.json(
      { error: "Image evaluation failed" },
      { status: 500 }
    );
  }
}
