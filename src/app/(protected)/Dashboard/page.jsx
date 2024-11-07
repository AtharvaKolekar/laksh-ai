"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/chat/header/Header";

import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";

import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import { Button, Modal, Empty, Typography, Steps } from "antd";
import { WechatOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import Typewriter from "typewriter-effect";
import MessageContainer from "@/components/messageContainer/MessageContainer";
import MessageRight from "@/components/messageContainer/MessageRight";
import MessageLeft from "@/components/messageContainer/MessageLeft";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const progresses = [
    {
        type: "Roadmap",
        title: "Web Development",
        subTitle: "Step",
        completedStep: 2,
        totalSteps: 5,
    },
    {
        type: "Virtual Internship",
        title: "Backend Development Internship",
        subTitle: "Task",
        completedStep: 3,
        totalSteps: 7,
    },
    {
        type: "Roadmap",
        title: "Data Science Path",
        subTitle: "Step",
        completedStep: 0,
        totalSteps: 6,
    },
    {
        type: "Virtual Internship",
        title: "Machine Learning Internship",
        subTitle: "Task",
        completedStep: 1,
        totalSteps: 4,
    },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isStarted, setIsStarted] = useState(false);

    const app = initFirebase();
    const database = getDatabase(app);
    const user = useUser();

    useEffect(() => {
        setIsStarted(progresses.length > 0);
    }, [progresses]);

    const [name, setName] = useState("");
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
            'You are a chatbot that helps user providing their queries solved. Provide a brief response text explaining the roadmap for the specified career. Then, return the function call details. \n\nList of function: \ngetRoadmap: gives the roadmap of requested career/interest,\ngetVirtualInternship: give the virtual internship program of requested career/interest.\n\nIf interest and career or request  is not requested and just a normal talk then return only response text and functionCalling be null.\nelse response like : " here is a ..." in just 2-3 lines.\n',
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
                response: { type: "string" },
                functionCalling: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            functionName: { type: "string" },
                            parameter: { type: "string" },
                        },
                    },
                },
            },
        },
    };
    const handleSendMessage = async () => {
        showLoading(true);
        const chatSession = model.startChat({
            generationConfig,
            history: [
                ...messages.map((message) => ({
                    ...message,
                    parts: message.parts || [{ text: message.text }], // Ensure parts exist
                })),
                {
                    role: "user",
                    parts: [{ text: userInput }], // Proper format for user input
                },
            ],
        });

        const result = await chatSession.sendMessage(userInput);

        // Parse the result text from model response
        const parsedResponse = JSON.parse(result.response.text());

        // Create the new message structure with the parsed response
        console.log(messages);
        const newMessages = [
            ...messages,
            { role: "user", parts: [{ text: userInput }] },
            {
                role: "model",
                parts: [
                    {
                        text: parsedResponse.response,
                    },
                ],
            },
        ];
        // Ensure messages state is updated correctly to trigger re-render
        setMessages(newMessages);

        // Handle function call if available
        if (
            parsedResponse.functionCalling &&
            parsedResponse.functionCalling.length > 0
        ) {
            parsedResponse.functionCalling.forEach((func) => {
                // Handle the function calls here (e.g., call an API)
                console.log(
                    `Function: ${func.functionName}, Parameter: ${func.parameter}`
                );
            });
        }

        setUserInput("");
        showLoading(false); // Clear the input field after sending the message
    };

    const showLoading = () => {
        setOpen(true);
        setLoading(true);
        setLoading(false);
    };

    return (
        <main>
            {children}
            <div className={styles.container}>
                <h4 className={styles.conTitle}>Quick Access</h4>
                <div className={styles.modules}>
                    <div
                        className={styles.module}
                        onClick={() =>
                            router.push("/Dashboard/RecommendCareer")
                        }
                    >
                        <img src="/career.png" alt="career" />
                        <div className={styles.module_title}>
                            Career Recommendation
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Roadmaps")}
                    >
                        <img src="/roadmap.png" alt="roadmap" />
                        <div className={styles.module_title}>
                            Roadmap Builder
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Internship")}
                    >
                        <img src="/internship.png" alt="internship" />
                        <div className={styles.module_title}>
                            Virtual Internship
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Mentors")}
                    >
                        <img src="/mentor.png" alt="mentor" />
                        <div className={styles.module_title}>
                            Mentor Guidance{" "}
                        </div>
                    </div>
                </div>
                <h4 className={styles.conTitle}>Top Career Opportunities</h4>
                <div className={styles.topCareers}>
                    <div className={styles.careers}>
                        <div className={styles.career + " " + styles.a}>
                            <p>1. Data Scientist</p>
                        </div>
                        <div className={styles.career + " " + styles.b}>
                            <p>2. Cloud Architect</p>
                        </div>
                        <div className={styles.career + " " + styles.c}>
                            <p>3. AI/Machine Learning Engineer</p>
                        </div>
                        <div className={styles.career + " " + styles.d}>
                            <p>4. Cybersecurity Engineer</p>
                        </div>
                        <div className={styles.career + " " + styles.e}>
                            <p>5. DevOps Engineer</p>
                        </div>
                    </div>
                    <img src="/pie.png" alt="pie" />
                </div>

                <h4 className={styles.conTitle}>Your Progress</h4>
                {!isStarted ? (
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{ height: 60 }}
                        description={
                            <Typography.Text>
                                You have not yet started any progress.
                            </Typography.Text>
                        }
                    >
                        <Button type="primary">Get Started</Button>
                    </Empty>
                ) : (
                    progresses.map((progress, index) => {
                        const currentStep = progress.completedStep - 1;

                        return (
                            <div key={index} className={styles.progress}>
                                <h5>
                                    {progress.type}: {progress.title}
                                </h5>
                                <Steps
                                    direction="horizontal"
                                    current={currentStep}
                                    items={Array.from(
                                        { length: progress.totalSteps },
                                        (_, i) => ({
                                            title: `${progress.subTitle} ${
                                                i + 1
                                            }`,
                                            description:
                                                i < progress.completedStep - 1
                                                    ? "Completed"
                                                    : i === currentStep
                                                    ? "In Progress"
                                                    : "Pending",
                                        })
                                    )}
                                />
                            </div>
                        );
                    })
                )}
                <Button
                    shape="circle"
                    className={styles.btn}
                    variant="outlined"
                    icon={<WechatOutlined />}
                    onClick={showLoading}
                    size={"large"}
                />
                <Modal
                    width={400}
                    title={<p>LakshAI</p>}
                    style={{
                        position: "fixed",
                        top: 10,
                        right: 20,
                    }}
                    loading={loading}
                    footer={
                        <Search
                            placeholder="Ask me anything"
                            allowClear
                            enterButton="Send"
                            size="large"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onSearch={handleSendMessage}
                        />
                    }
                    open={open}
                    onCancel={() => setOpen(false)}
                >
                    <div className={styles.modal}>
                        {messages.map((message, index) => {
                            if (message.role === "user") {
                                return (
                                    <MessageRight
                                        key={index}
                                        text={message.parts[0].text}
                                    />
                                );
                            } else {
                                return (
                                    <>
                                        <MessageLeft
                                            key={index}
                                            text={message.parts[0].text}
                                            callback={() => {}}
                                        />
                                        <Button>
                                            {message.functionCalling}
                                        </Button>
                                    </>
                                );
                            }
                        })}
                    </div>
                </Modal>
            </div>
        </main>
    );
}
