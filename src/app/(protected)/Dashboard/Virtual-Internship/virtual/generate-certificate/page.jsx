"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import "@/app/virtual.css";
import CertificateCanvasPage from "@/app/cert/page";

const GenerateCertificate = () => {
  return (
    <Suspense fallback={<div>Loading certificate details...</div>}>
      <CertificateContent />
    </Suspense>
  );
};

const CertificateContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const internshipKey = searchParams.get("internshipKey");
  const user = useUser();
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false)
  const [userData, setUserData] = useState()
  // Fetch user UID and set it
  useEffect(() => {
    if (user && user.uid) {
      setUid(user.uid);
    }
  }, [user]);

  // Fetch internship data from Firebase when internshipKey and uid are available
  useEffect(() => {
    if (internshipKey && uid) {
      const fetchInternshipData = async () => {
        const db = getDatabase();
        const internshipRef = ref(db, `UserData/${uid}/internships/${internshipKey}`);
        const userRef = ref(db, `UserData/${uid}/Details`)
        const snapshot = await get(internshipRef);
        const userSnap = await get(userRef)
        if (snapshot.exists()) {
          setInternshipData(snapshot.val());
          console.log("data", snapshot.val());
        } else {
          console.log("No such document!");
        }
        if(userSnap.exists()){
          console.log(userSnap.val());
          setUserData(userSnap.val())
        }else{
          console.log("User not found");
        }
        setLoading(false);
      };
      fetchInternshipData();
    }
  }, [internshipKey, uid]);

  // Handle the certificate generation
  const handleGenerateCertificate = async () => {
    if (internshipData && uid) {
      try {
        const internshipRef = ref(database, `UserData/${uid}/internships/${internshipKey}`);
        // await update(internshipRef, {
        //   internshipComplete: true,
        // });
        setIsGenerated(true)
        router.push("/Dashboard/Virtual-Internship/virtual/generate-certificate");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  // Handle the loading state
  if (loading || !uid) {
    return <div>Loading...</div>;
  }

  if (!internshipData) {
    return <div>No internship data found</div>;
  }
  console.log("Internship", internshipData.internshipData);
  const {
    completedPhases,
    internshipComplete,
    internshipData: { CompanyName, YourRole, companyDescription, internshipName, phases },
  } = internshipData;

  <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="40" font-family="Arial" font-size="24" fill="black">Hello, SVG!</text>
</svg>
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
      {
        isGenerated&& <div>
        <CertificateCanvasPage name={userData.name} course={YourRole.replace(/\sIntern$/, "")} certID={internshipKey} />
      </div>
      }

    </div>
  );
};

export default GenerateCertificate;
