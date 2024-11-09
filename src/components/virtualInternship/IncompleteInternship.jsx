"use client"
import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { database } from "@/lib/firebase";
import { ref, get, set, update } from "firebase/database";
import axios from "axios";
import {
  Button,
  Card,
  Modal,
  Spin,
  Steps,
  Popover,
  Input,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css"; // Import CodeMirror styles
import "codemirror/theme/material.css"; // Import the chosen theme
import "@/app/virtual.css"
import { useRouter } from "next/navigation";
const { Step } = Steps;

const IncompleteInternshipPage = () => {
  const user = useUser();
  const uid = user?.uid;
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [internshipData, setInternshipData] = useState(null);
  const [evaluationResponse, setEvaluationResponse] = useState({})
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPhaseTask, setCurrentPhaseTask] = useState(null); // To store task for the current phase
  const [userResponse, setUserResponse] = useState(""); // To store the user's response to the task

  useEffect(() => {
    async function fetchInternship() {
      try {
        const internshipRef = ref(database, `UserData/${uid}/internships`);
        const snapshot = await get(internshipRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // Find the first incomplete internship
          const incompleteInternshipEntry = Object.entries(data).find(
            ([, internship]) => internship.internshipComplete === false
          );

          if (incompleteInternshipEntry) {
            const [internshipKey, incompleteInternship] =
              incompleteInternshipEntry;
            const completedPhases = incompleteInternship.completedPhases || [];
            setInternshipData({
              ...incompleteInternship.internshipData,
              completedPhases,
              internshipKey,
            });
          } else {
            console.log("No incomplete internship found.");
          }
        } else {
          console.log("No data available in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching internship data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchInternship();
    }
  }, [user, uid]);
  const router = useRouter()
  useEffect(() => {
    console.log("internshipData", internshipData);
    if (internshipData) {

      const isLastPhase = internshipData.completedPhases.length === internshipData.phases.length;
      console.log(isLastPhase);
      if (isLastPhase&&internshipData.internshipKey) {
        // Navigate to the certificate generation route
        console.log("internshipKey", internshipData.internshipKey);
        const url = `/virtual/generate-certificate?internshipKey=${internshipData.internshipKey}`;
      
      // Navigate to the URL with query parameter
      router.push(url);
      }
    }
  }, [internshipData, router]);
  const handleRouting = () => {
    const isLastPhase = internshipData.completedPhases.length === phases.length;
    
    if (isLastPhase && evaluationResponse.score > 50) {
      // Navigate to the certificate generation route
      const url = `/virtual/generate-certificate?internshipKey=${internshipData.internshipKey}`;
      
      // Navigate to the URL with query parameter
      router.push(url);
    } else {
      // Reload page if not the last phase or the score condition isn't met
      window.location.reload();
    }
  };
  // Check if task data exists for the current phase when internshipData is loaded
  useEffect(() => {
    if (internshipData) {
      const internshipKey = internshipData.internshipKey;
      const currentPhaseIndex = internshipData.completedPhases.length;
      checkTaskForCurrentPhase(internshipKey, currentPhaseIndex);
    }
  }, [internshipData]);

  // Function to check if task data exists for the current phase
  async function checkTaskForCurrentPhase(internshipKey, phaseIndex) {
    if (!uid || !internshipKey) return;

    const taskRef = ref(
      database,
      `UserData/${uid}/internships/${internshipKey}/internshipData/phases/${phaseIndex}/evaluationTask`
    );
    const snapshot = await get(taskRef);

    if (snapshot.exists()) {
      setCurrentPhaseTask(JSON.parse(snapshot.val()).response); // Set the task data if it exists
    } else {
      console.log("Task not found in Firebase, fetching from API...");
      await fetchTaskFromAPIAndSave(internshipKey, phaseIndex); // Fetch from API if task doesn't exist
    }
  }

  // Function to fetch task from API and store it in Firebase
  async function fetchTaskFromAPIAndSave(internshipKey, phaseIndex) {
    try {
      console.log(internshipKey, phaseIndex);
      if (
        !internshipData ||
        !internshipData.phases ||
        !internshipData.phases[phaseIndex]
      ) {
        console.warn(
          "Internship data or phase data is not available. Aborting API call."
        );
        return;
      }

      const apiResponse = await axios.post(
        "/api/virtual-internship/generate-task",
        {
          phaseData: internshipData.phases[phaseIndex],
        }
      );

      const taskData = apiResponse.data.response;
      console.log("API Response:", apiResponse.data);
      const taskRef = ref(
        database,
        `UserData/${uid}/internships/${internshipKey}/internshipData/phases/${phaseIndex}/evaluationTask`
      );
      await set(taskRef, taskData);

      setCurrentPhaseTask(JSON.parse(taskData).response); // Set the fetched task to the state
    } catch (error) {
      console.error("Error fetching task from API:", error);
    }
  }

  // Function to handle user input
  const handleUserInput = (value) => {
    setUserResponse(value); // Store the user's response
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      // Send the file to the server using axios POST request
      const response = await axios.post('/api/virtual-internship/evaluate-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle the server response
      if (response.status === 200) {
        message.success(`${file.name} file uploaded successfully.`);
      } else {
        message.error('Failed to upload the file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Error uploading file.');
    }
  };
  if (loading) {
    return <Spin size="large" className="spinner flex justify-center items-center h-screen" />;
  }

  if (!internshipData) {
    return <div>No incomplete internship found.</div>;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const customDot = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          Phase {index + 1}: {status}
        </span>
      }
      title={`Phase ${index + 1} Info`}
    >
      {dot}
    </Popover>
  );
  
  const phases = internshipData.phases || [];
  const steps = phases.map((phase, index) => {
    const isCompleted = internshipData.completedPhases==index
    const isNextPhase = index === internshipData.completedPhases.length;
    const phaseStatus = isCompleted
      ? "finish"
      : isNextPhase
      ? "process"
      : "wait";
    console.log(currentPhaseTask);
    return {
      title: `Phase ${index + 1}`,
      description: phase.task,
      status: phaseStatus,
    };
  });
  const handleEditorChange = (value) => {
    setUserResponse(value); // Update the state with the new value from Monaco Editor
  };
  
  const handleTaskSubmission = async () => {
    try {
      const taskType = currentPhaseTask?.taskType;
      if (taskType === "WRITTEN_EXPLANATION"||taskType=="CODE_SUBMISSION") {
       const response =  await axios.post("/api/virtual-internship/evaluate-text", { userResponse, taskDescription:currentPhaseTask.task });
      console.log("data",response.data);
       if(response.status==200){
        
        setIsEvaluated(true);
        setEvaluationResponse(response.data)
        console.log(`UserData/${uid}/internships/${internshipData.internshipKey}`);
        console.log("status", response.data);
        if(response.data.score>50){
          console.log("hello");
          const internshipRef = ref(
            database,
            `UserData/${uid}/internships/${internshipData.internshipKey}/completedPhases`
          );
          console.log(internshipData);
          // Increment completed phases and store evaluation result
          await set(internshipRef, 
            [...internshipData.completedPhases, internshipData.completedPhases.length]
          );
        }
      
       }
      } else if (taskType === "SCREENSHOT_UPLOAD" || taskType === "CODE_ANALYSIS_OUTPUT") {
        await axios.post("/api/virtual-internship/evaluate-image", { file: userResponse, taskDescription: currentPhaseTask.task });
      } 
      message.success("Task submitted successfully!");
    } catch (error) {
      console.error("Error submitting task:", error);
      message.error("Failed to submit task.");
    }
  };
  const currentPhaseIndex = internshipData.completedPhases.length;
  const currentPhase = phases[currentPhaseIndex];

  return (
    <div className="h-full p-10">
      <div className="text-4xl text-center tracking-wide text-indigo-600 font-bold font-poppins mb-8">
        Ongoing Virtual Internship
      </div>

      <div className="mb-10">
        
        <Card bordered={false} className="mb-6 text-xl font-poppins">
          <div>
            <strong>Company Name:</strong> {internshipData.CompanyName}
          </div>
          <p>
            <strong>Company Description:</strong>{" "}
            {internshipData.companyDescription}
          </p>
          <p>
            <strong>Your Role:</strong> {internshipData.YourRole}
          </p>
        </Card>
      </div>

      <div className="p-6 rounded-lg border-2">
        <div className="text-2xl font-semibold text-indigo-600 mb-6">
          Internship Progress
        </div>
        <Steps
          current={internshipData.completedPhases.length}
          progressDot={customDot}
          direction="vertical"
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
              status={step.status}
            />
          ))}
        </Steps>
      </div>

      {currentPhase && (
        <div className="mt-2 p-6  rounded-lg border-2 ">
          <h2 className="text-xl font-semibold mb-3 text-indigo-600">
            Current Phase: {`Phase ${currentPhaseIndex + 1}`}
          </h2>
          <p className="text-md text-gray-700">
            <strong>Task:</strong>{" "}
            {currentPhase.task || "No task found for this phase"}
          </p>
          <p className="text-md text-gray-700">
            <strong>Deadline:</strong> {currentPhase.deadline}
          </p>
          <p className="text-md text-gray-700">
            <strong>Guidance:</strong> {currentPhase.guidance}
          </p>
          <p className="text-md text-gray-700">
            <strong>Topics Covered:</strong> {currentPhase.topicsCovered}
          </p>
          <p className="text-md text-gray-700">
            <strong>Steps:</strong>
          </p>
          <ul className="list-disc pl-6">
            {currentPhase.steps.map((step, index) => (
              <li key={index} className="text-gray-700">
                {step}
              </li>
            ))}
          </ul>

          {/* Display Task Input Based on Task Type */}
          {currentPhaseTask&&!isEvaluated && (
            <div className="mt-6 bg-gray-200 p-3 rounded-md">
              <h3 className="text-xl text-indigo-600">Task To be Submitted</h3>
              <p><strong>Task: </strong>{currentPhaseTask.task}</p>

              {/* Render Input Field Based on Task Type */}
              {currentPhaseTask.taskType === "WRITTEN_EXPLANATION" && (
                <div className="m-2"> <Input.TextArea
                rows={4}
                value={userResponse}
                onChange={(e) => handleUserInput(e.target.value)}
                placeholder="Write your explanation here"
              />
              <button onClick={()=>handleTaskSubmission()} className="border-indigo-600 border-2 p-2 rounded m-2 self-center">Submit</button></div>
               
              )}

              {currentPhaseTask.taskType === "SCREENSHOT_UPLOAD" && (
                <Upload
                  beforeUpload={handleFileUpload}
                  showUploadList={false}
                  customRequest={({ file }) => handleFileUpload(file)}
                >
                  <Button icon={<UploadOutlined />}>Upload Screenshot</Button>
                </Upload>
              )}
              {currentPhaseTask.taskType === "CODE_SUBMISSION" && (
                <div>
                  <h4 className="text-lg text-indigo-600">Submit Your Code</h4>
                  <Editor
                    height="400px"
                    language="javascript"
                    theme="vs-dark"
                    value={userResponse} // Bind the state to Monaco's value prop
                    onChange={handleEditorChange} // Bind the onChange event
                  />
                  <Button onClick={()=>handleTaskSubmission()}>Sumbit Your Code</Button>
                </div>
              )}
              {currentPhaseTask.taskType === "CODE_ANALYSIS_OUTPUT" && (
                <div>
                  <h4 className="text-lg text-indigo-600">
                    Upload Code Analysis Output
                  </h4>
                  <Upload
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    customRequest={({ file }) => handleFileUpload(file)}
                  >
                    <Button icon={<UploadOutlined />}>Upload Output</Button>
                  </Upload>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div>
      {isEvaluated && evaluationResponse && (
        <div className="p-3 border-2 mt-2 rounded">
          <h1 className="text-xl text-indigo-600">Ai Evaluation</h1>
          <div><strong>Score:</strong> {evaluationResponse.score}</div>
          <div><strong>Feedback:</strong> {evaluationResponse.feedback}</div>
          <div><strong>Issues or Improvements:</strong> {evaluationResponse.issuesOrImprovement}</div>
          <Button onClick={handleRouting}>
              {(internshipData.completedPhases.length === phases.length-1)&&(internshipData.score>50)
                ? "Generate Certificate"
                : "Continue"}
            </Button>
        </div>
      )}
    </div>
    </div>
  );
};

export default IncompleteInternshipPage;
