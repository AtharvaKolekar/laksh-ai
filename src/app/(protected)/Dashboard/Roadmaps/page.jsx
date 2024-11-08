"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/RecommendCareerComponents/LoadingComponent";
import { Steps, Divider, Typography, List, Card, Tag } from "antd";
import { Input, Button, Row, Col } from "antd";
const { Step } = Steps;
const { Title, Paragraph } = Typography;
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSearchParams } from "next/navigation";

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
  const app = initFirebase();
  const database = getDatabase(app);
  const user = useUser();

  const [input, setInput] = useState(""); // Manage input state
  const [roadmap, setRoadmap] = useState(null); // Store the result
  const [name, setName] = useState(""); // Store user's name
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams(); // Default to empty string if not found

  useEffect(() => {
    const career = searchParams.get("career") || ""; // Get 'career' query param
    console.log("Career:", career); // Log the career parameter
    if (career) {
      setInput(career);
      handleSubmit(career); // Call handleSubmit if needed
    }
  }, [searchParams]); // Runs when 'career' changes

  useEffect(() => {
    if (user) {
      console.log(user);
      get(child(ref(database), `UserData/${user.uid}/a`)).then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
        } else {
          console.log("No data available");
        }
      });
    }
  }, [user, database]);

  const handleSubmit = async (i, e) => {
    // if (e) e.preventDefault();
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(i);
      const responseText = await result.response.text();
      const roadmapData = JSON.parse(responseText); // Assuming the response is a valid JSON string.

      // Set the parsed JSON to render dynamically
      setRoadmap(roadmapData);

      setLoading(false);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    }
  };
  const suggestedCareers = [
    "Software Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Web Developer",
    "Product Manager",
  ];
  return (
    <main>
      <div className={styles.container}>
        {/* Career roadmap form */}
        <div
          style={{
            height: "30vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "2rem" }}>
            Tell us what you&apos;re aspiring to be
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "1rem",
              marginBottom: "2rem",
              padding: "0 2rem",
            }}
          >
            Fill in the career name you&apos;re aspiring for, and let us help guide
            you!
          </p>

          {/* Search bar with submit button */}
          <div
            // onSubmit={(e) => handleSubmit(input, e)}
            style={{ textAlign: "center" }}
          >
            {/* <Input
              type="text"
              placeholder="Enter career name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: "60%", marginRight: "1rem" }}
            />
            <Button type="primary" htmlType="submit" style={{ height: "40px" }}>
              Submit
            </Button> */}
            <Input.Search 
                placeholder="Enter career name"
                allowClear
                enterButton="Submit"
                size="large"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSearch={(e) => handleSubmit(input, e)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(input, e)
                    }
                }}
                style={{ width: "100%", maxWidth: 800, padding: "0 1.5rem", }}

            />
            
          </div>
        </div>

        {/* Render roadmap dynamically if available */}
        {!loading ? (
          roadmap && <Roadmap roadmap={roadmap} />
        ) : (
          <LoadingComponent />
        )}
      </div>
    </main>
  );
}

const Roadmap = ({ roadmap }) => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    setCurrent(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>{roadmap.title}</Title>
      <Paragraph>{roadmap.description}</Paragraph>

      {/* Main Steps */}
      <Steps current={current} onChange={onChange} direction="vertical">
        {roadmap.steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

      <Divider />

      {/* Step Content */}
      <div style={{ marginTop: "20px" }}>
        <Title level={3}>{roadmap.steps[current].title}</Title>
        <Paragraph>{roadmap.steps[current].description}</Paragraph>

        <Title level={5}>Skills you'll learn</Title>
        {roadmap.steps[current].skills.map((s) => (
          <Tag key={s} color="processing">{s}</Tag>
        ))}

        <Divider />

        <Title level={4}>Sub-Steps</Title>
        {roadmap.steps[current].sub_steps.map((subStep, idx) => (
          <Card key={idx} style={{ marginBottom: "10px" }}>
            <Title level={5}>{subStep.title}</Title>
            <Paragraph>{subStep.description}</Paragraph>
            {subStep.skills.map((s) => (
              <Tag key={s} color="green">{s}</Tag>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};
