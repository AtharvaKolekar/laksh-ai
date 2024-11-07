"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/RecommendCareerComponents/LoadingComponent";
import { GoogleGenerativeAI } from "@google/generative-ai";
// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "GIVE THE ROADMAP OF THE PROVIDED CAREER: ",
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
      title: {
        type: "string",
        description:
          "The title of the roadmap, e.g., 'Web Development Roadmap'",
      },
      description: {
        type: "string",
        description: "A brief overview of the roadmap and what it covers",
      },
      steps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "The title of the step, e.g., 'Step 1: Basics of Web Development'",
            },
            description: {
              type: "string",
              description: "A description of what this step covers",
            },
            skills: {
              type: "array",
              items: {
                type: "string",
                description: "Skills covered in this step, e.g., 'HTML', 'CSS'",
              },
            },
            sub_steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description:
                      "The title of the sub-step, e.g., 'Learn HTML'",
                  },
                  description: {
                    type: "string",
                    description:
                      "Description of the sub-step, detailing what it covers",
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "string",
                      description:
                        "Skills covered in this sub-step, e.g., 'Tags', 'Attributes'",
                    },
                  },
                },
                required: ["title", "description", "skills"],
              },
            },
          },
          required: ["title", "description", "skills", "sub_steps"],
        },
      },
    },
    required: ["title", "description", "steps"],
  },
};

export default function Dashboard() {
  const router = useRouter();
  const app = initFirebase();
  const database = getDatabase(app);
  const user = useUser();

  const [input, setInput] = useState(""); // Manage input state
  const [roadmap, setRoadmap] = useState(null); // Store the result
  const [name, setName] = useState(""); // Store user's name
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      get(child(ref(database), `UserData/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
        } else {
          console.log("No data available");
        }
      });
    }
  }, [user, database]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(input);
      const responseText = await result.response.text();
      const roadmapData = JSON.parse(responseText); // Assuming the response is a valid JSON string.

      // Set the parsed JSON to render dynamically
      setRoadmap(roadmapData);
      setLoading(false);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    }
  };

  return (
    <main>
      <div className={styles.container}>
        {/* Display user info */}
        {user && name && <h1>Welcome, {name}!</h1>}

        {/* Career roadmap form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter career name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>

        {/* Render roadmap dynamically if available */}
        {!loading ? (
          roadmap && (
            <div className={styles.roadmapContainer}>
              <h2>{roadmap.title}</h2>
              <p>{roadmap.description}</p>
              <div className={styles.stepsContainer}>
                {roadmap.steps.map((step, index) => (
                  <div className={styles.step} key={index}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <div className={styles.skills}>
                      {step.skills.map((skill, i) => (
                        <span key={i} className={styles.skill}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Render Sub-Steps */}
                    {step.sub_steps.map((subStep, j) => (
                      <div className={styles.subStep} key={j}>
                        <h4>{subStep.title}</h4>
                        <p>{subStep.description}</p>
                        <ul>
                          {subStep.skills.map((subSkill, k) => (
                            <li key={k}>{subSkill}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <LoadingComponent />
        )}
      </div>
    </main>
  );
}
