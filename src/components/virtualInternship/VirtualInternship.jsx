"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/lib/auth";
import { database } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ref, set, push, get } from "firebase/database";

import LoadingComponent from "../RecommendCareerComponents/LoadingComponent";
function VirtualInternship() {
  const user = useUser();
  const router = useRouter();
  const uid = user?.uid;
  const [internshipData, setInternshipData] = useState(null);
  const [newInternship, setNewInternship] = useState(true);
  const internshipRef = ref(database, `UserData/${uid}/internships`);
  let incompleteInternship = null;

  async function addInternship(internshipData) {
    try {
      console.log(`UserData/${uid}/internships`);
      const newInternshipRef = await push(internshipRef);

      await set(newInternshipRef, {
        internshipData: internshipData,
        completedPhases: 0,
        internshipComplete: false,
      });
      console.log("Internship added successfully!");
    } catch (error) {
      console.error("Error adding internship:", error);
    }
  }
  async function loadInternshipData() {
    try {
      console.log("user", user);
      console.log("Firebase path:", `UserData/${uid}/internships`);

      console.log("internshipRef", internshipRef);
      const snapshot = await get(internshipRef);
      console.log("Snapshot", snapshot);

      if (snapshot.exists()) {
        const internshipData = snapshot.val();
        console.log("Internship data:", internshipData);
        return internshipData;
      } else {
        console.log("No data available for this user.");
        return null;
      }
    } catch (error) {
      console.error("Error loading internship data:", error);
      return null;
    }
  }

  useEffect(() => {
    async function sendRequest() {
      try {
        const internshipDataFromFirebase = await loadInternshipData();
        const currentPath = window.location.href;
        console.log("Current Path with Query:", currentPath);

        // Example of extracting query parameters manually (if you don't want to use `router.query`)
        const queryString = currentPath.split("?")[1];

        if (internshipDataFromFirebase) {
          incompleteInternship = Object.values(internshipDataFromFirebase).find(
            (internship) => internship.internshipComplete === false
          );
        }

        console.log("FirebaseStatus", internshipDataFromFirebase);
        if (internshipDataFromFirebase == null) {
          // Only call server if Firebase data does not exist
          const params = new URLSearchParams(queryString);
          const field = params.get("field");
          const duration = params.get("duration");
          console.log("Field:", field);
          console.log("Duration:", duration);
          const response = await axios.post(
            `/api/virtual-internship/user-internship?field=${field}&duration=${duration}`
          );

          console.log("called server");
          const internship = JSON.parse(response.data.internship);
          setInternshipData(internship);
        } else {
          // Set the data from Firebase if it exists
          setInternshipData(incompleteInternship.internshipData);
          setNewInternship(false);
          console.log("Firebase retrieved");
        }
      } catch (error) {
        console.error("Error fetching internship data:", error);
      }
    }

    // Only call sendRequest if the user is defined
    if (user) {
      sendRequest();
    }
  }, [user, uid]);

  if (!internshipData) {
    return <div className="h-screen flex justify-center items-center"><LoadingComponent/></div>;
  }

  return (
    <div className="h-full p-10 ">
      {/* Main Title */}
      <div className="text-4xl text-center tracking-wide text-indigo-600 font-bold font-poppins mb-8">
        Welcome to Your Virtual Internship
      </div>

      {/* Internship Info Section */}
      <div className="mb-10 border-indigo-400 p-4 rounded-lg border-2">
    

        {/* Company Name */}
        <div className="text-xl text-gray-700 mb-4">
          <span className="font-semibold text-indigo-500">Virtual Company Name: </span>
          {internshipData.CompanyName}
        </div>

        {/* Company Description */}
        <div className="text-xl text-gray-700 mb-4">
          <span className="font-semibold text-indigo-500">
            Company Description:{" "}
          </span>
          {internshipData.companyDescription}
        </div>

        {/* Your Role */}
        <div className="text-xl text-gray-700 mb-4">
          <span className="font-semibold text-indigo-500">Your Role: </span>
          {internshipData.YourRole}
        </div>
      </div>

      {/* Internship Phases Section */}
      <div className=" p-6 rounded-lg ">
        <div className="text-2xl font-semibold text-indigo-600 mb-6 text-center">
          Internship Overview
        </div>

        {/* Phases */}
        {internshipData.phases.map((phase, index) => (
          <div key={index} className="p-4 border-2 m-3 ">
            {/* Phase Title */}
            <h2 className="text-2xl font-semibold text-indigo-600">
              Phase {index + 1}
            </h2>

            {/* Task */}
            <div className="mt-2">
              <p className="font-medium text-gray-700">
                <span className="font-bold text-indigo-500">Task:</span>{" "}
                {phase.task}
              </p>
            </div>

            {/* Deadline */}
            <div className="mt-2">
              <p className="font-medium text-gray-700">
                <span className="font-bold text-indigo-500">Deadline:</span>{" "}
                {phase.deadline}
              </p>
            </div>

            {/* Topics Covered */}
            <div className="mt-2">
              <p className="font-medium text-gray-700">
                <span className="font-bold text-indigo-500">
                  Topics Covered:
                </span>{" "}
                {phase.topicsCovered}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional Start/Continue Section */}
      <div className="flex justify-center items-center p-6">
        <div className="p-8 rounded-lg w-full sm:w-1/2 lg:w-1/3">
          <div className="text-center mb-6">
            {/* Conditional Heading */}
            {newInternship ? (
              <h1 className="text-3xl font-bold text-indigo-600">
                Let's Start
              </h1>
            ) : (
              <h1 className="text-3xl font-bold text-indigo-600">
                Continue from where you left
              </h1>
            )}
          </div>

          {/* Description Section */}
          <div className="text-center mb-6">
            {newInternship ? (
              <p className="text-lg text-gray-700">
                We're excited to have you start a new journey!
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                Pick up where you left off and continue your progress!
              </p>
            )}
          </div>

          {/* Button Section */}
          <div className="text-center">
            <button
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
              onClick={() => {
                newInternship ? addInternship(internshipData) : null;
                router.push("/virtual/test");
              }}
            >
              {newInternship ? "Start New Internship" : "Continue Internship"}
            </button>
            {newInternship && (
              <button
                onClick={() => {
                  console.log("Button clicked");
                  window.location.reload();
                }}
                className="underline text-indigo-600 p-2 font-semibold"
              >
                Generate New Internship
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualInternship;
