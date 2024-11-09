"use client"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";  // Import useSearchParams hook
import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";  // Import necessary functions from Realtime Database
import { database } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import "@/app/virtual.css"

const GenerateCertificate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();  // Get search parameters from the URL
  const internshipKey = searchParams.get("internshipKey");  // Access the 'internshipKey' query parameter
  const user = useUser();
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for both user and internship data
  const [uid, setUid] = useState(null); // State to store uid

  
  // Fetch user UID and set it
  useEffect(() => {
    if (user && user.uid) {
      setUid(user.uid); // Store uid once it's available
    }
  }, [user]);

  // Fetch internship data from Firebase when internshipKey and uid are available
  useEffect(() => {
    if (internshipKey && uid) {
      const fetchInternshipData = async () => {
        const db = getDatabase();  // Initialize Realtime Database
        const internshipRef = ref(db, `UserData/${uid}/internships/${internshipKey}`);  // Reference to the specific internship
        const snapshot = await get(internshipRef);  // Fetch data from the Realtime Database
        if (snapshot.exists()) {
          setInternshipData(snapshot.val());
          console.log("data",snapshot.val());
        } else {
          console.log("No such document!");
        }
        setLoading(false); // Set loading to false once data is fetched
      };

      fetchInternshipData();
    }
  }, [internshipKey, uid]); // Trigger when both internshipKey and uid change

  // Handle the certificate generation
  const handleGenerateCertificate = async () => {
    if (internshipData && uid) {
      try {
        const db = getDatabase();  // Initialize Realtime Database
        const internshipRef = ref(database, `UserData/${uid}/internships/${internshipKey}`);  // Reference to the specific internship
        await update(internshipRef, {
          internshipComplete: true,  // Update the internshipComplete field in Realtime Database
        });

        // Optionally, redirect to a confirmation page or show a success message
        router.push("/certificate-generated");  // Adjust the path if needed
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  // Handle the loading state
  if (loading || !uid) {
    return <div>Loading...</div>;  // Show a loading state if either the user or internship data is not available
  }

  if (!internshipData) {
    return <div>No internship data found</div>;  // Handle case where no internship data is found
  }
  const {
    completedPhases,
    internshipComplete
  } = internshipData;
  const {
    CompanyName,
    YourRole,
    companyDescription,
    internshipName,
    phases,
  } = internshipData.internshipData;
  return (
    <div className="bg-[#f0f8ff] py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl text-indigo-600 text-center mb-4">Congratulations on Completing Your Internship!</h1>
        <h2 className="text-2xl text-indigo-600 mb-6">Internship Details</h2>
        
        <p className="text-lg"><strong>Internship Key:</strong> {internshipKey}</p>
        <p className="text-lg"><strong>Company Name:</strong> {CompanyName}</p>
        <p className="text-lg"><strong>Your Role:</strong> {YourRole}</p>
        <p className="text-lg"><strong>Company Description:</strong> {companyDescription}</p>
        <p className="text-lg"><strong>Duration:</strong> 1 month</p>
        <p className="text-lg"><strong>Completed Phases:</strong> {completedPhases.length} out of {phases.length}</p>
  
        <button 
          onClick={handleGenerateCertificate} 
          className="mt-6 py-2 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-500 transition"
        >
          Generate Certificate
        </button>
      </div>
    </div>
  );
  
};

export default GenerateCertificate;
