"use client";

import { Button, Modal, Skeleton, Input } from "antd";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
// import { WechatOutlined } from "@ant-design/icons";
// import Search from "antd/es/input/Search";
import Typewriter from "typewriter-effect";
import MessageContainer from "@/components/messageContainer/MessageContainer";
import MessageRight from "@/components/messageContainer/MessageRight";
import MessageLeft from "@/components/messageContainer/MessageLeft";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";

const { Search } = Input;

export default function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isGreeted, setIsGreeted] = useState(false);
    const [msg,setMsg]=useState([]);
    const router=useRouter();
    const getRoadmap = (career) => {
        setOpen(false);
        router.push(`/Dashboard/Roadmaps?career=${encodeURIComponent(career)}`);
        
      };

    const containerRef = useRef(null);
    useEffect(() => {
        // Auto scroll to bottom on load
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
            'You are a LakshAi that helps user providing their queries solved. Provide a brief response text explaining the roadmap for the specified career. Then, return the function call details. \n\nList of function: \ngetRoadmap: gives the roadmap of requested career/interest,\ngetVirtualInternship: give the virtual internship program of requested career/interest.\n\nIf interest and career or request  is not requested and just a normal talk then return only response text and functionCalling be null.\nelse response like : " here is a ..." in just 2-3 lines.\n',
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
        setLoading(true);
        setIsTyping(true);
        setUserInput("");
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
        console.log("msg:"+msg);
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
        const newMsgs = [
            ...msg,
            { role: "user", parts: [{ text: userInput }] },
            {
                role: "model",
                parts: [
                    {
                        text: parsedResponse.response,
                        functions:parsedResponse.functionCalling
                    },
                ],
            },
        ];

        // Ensure messages state is updated correctly to trigger re-render
        setMessages(newMessages);
        setMsg(newMsgs)

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

        setLoading(false); // Clear the input field after sending the message
    };

    const showLoading = () => {
        setOpen((open) => !open);
        if (isGreeted) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    return (
        <div>
            {children}
            <Button
                className={styles.btn}
                icon={
                    <img src="/bot.png" width={80} height={80} alt="gemini" />
                }
                onClick={showLoading}
            />
            <Modal
                className={styles.mainModal}
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        Welcome to LakshAI
                        <svg fill="#ba0ffd" viewBox="0 0 24 24" width="20">
                            <path d="M16 20L17.6 14.6L23 13L17.6 11.4L16 5.99999L14.4 11.4L9 13L14.4 14.6L16 20Z"></path>
                            <path d="M7.5 21L8.3 18.3L11 17.5L8.3 16.7L7.5 14L6.7 16.7L4 17.5L6.7 18.3L7.5 21Z"></path>
                            <path d="M7.5 10.8L8.07143 8.87142L10 8.29999L8.07143 7.72856L7.5 5.79999L6.92857 7.72856L5 8.29999L6.92857 8.87142L7.5 10.8Z"></path>
                        </svg>
                    </div>
                }
                footer={
                    <Search
                        placeholder="Ask me anything"
                        allowClear
                        enterButton="Send"
                        size="large"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onSearch={handleSendMessage}
                        disabled={isTyping}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                    />
                }
                open={open}
                onCancel={() => setOpen(false)}
            >
                <div className={styles.modal} ref={containerRef}>
                    {(!loading || isGreeted) && (
                        <MessageLeft
                            text={"Hello there👋 I'm LakshAI your personal AI Mentor ✨ How can I help you today?"}
                            callback={() => setIsGreeted(true)}
                        />
                    )}
                    {msg.map((message, index) => {
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
                                  {message.parts[0].functions?.map(i=><>
                                    {
                                        i.functionName=="getRoadmap"?
                                        <Button onClick={()=>getRoadmap(i.parameter)} style={{ margin: '5px' }} color="primary" variant="outlined">
                                        Explore {i.parameter} Roadmap
                                        </Button>:
                                        <>
                                        {i.functionName=="getVirtualInternship"?
                                        <Button style={{ margin: '5px' }} color="danger" variant="outlined">
                                        Get a virtual internship in {i.parameter} 
                                        </Button>:
                                        <Button style={{ margin: '5px' }} color="default" variant="outlined">
                                        {i?.parameter} 
                                        </Button>
                                        }
                                        </>
                                        
                                    }
                                        
                                    </>)}
                                    <MessageLeft
                                        key={index}
                                        text={message.parts[0].text}
                                        callback={() => setIsTyping(false)}
                                    />
                                </>
                            );
                        }
                    })}
                    {loading ? <Skeleton active /> : null}
                </div>
            </Modal>
        </div>
    );
}
