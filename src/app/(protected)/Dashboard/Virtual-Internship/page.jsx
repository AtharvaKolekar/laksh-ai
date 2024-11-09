"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, get } from 'firebase/database';
import { useUser } from '@/lib/auth'; // Assuming you have an authentication context or hook for the user

import "@/app/virtual.css"

const Page = () => {
  const router = useRouter();
  const user = useUser(); // Get the user object from your auth context
  const [incompleteInternship, setIncompleteInternship] = useState(null);
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch incomplete internship data when the component mounts
  useEffect(() => {
    if (user && user.uid) {
      const fetchInternshipData = async () => {
        const db = getDatabase();
        const userRef = ref(db, `UserData/${user.uid}/internships`);  // Get all internships for the user
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const internships = snapshot.val();
          const incomplete = Object.values(internships).find(internship => !internship.internshipComplete);
          setIncompleteInternship(incomplete); // Set incomplete internship if exists
        } else {
          setIncompleteInternship(null); // No internships found
        }
        setLoading(false); // Set loading to false once data is fetched
      };

      fetchInternshipData();
    }
  }, [user]);

  // If there is an incomplete internship, redirect to /virtual
  useEffect(() => {
    if (!loading && incompleteInternship) {
      router.push('/Dashboard/Virtual-Internship/virtual'); // Redirect to /virtual if there's an incomplete internship
    }
  }, [loading, incompleteInternship, router]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (field && duration) {
      // Redirect to /virtual with query parameters
      router.push(`/Dashboard/Virtual-Internship/virtual?field=${field}&duration=${duration}`);
    }
  };

  // Show loading or form based on data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10">
      {!incompleteInternship && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl text-indigo-600 text-center mb-4">Start Your Internship</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Field of Internship</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter the field of internship (e.g., Frontend Development)"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Duration of Internship</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter the duration of the internship (e.g., 1 month)"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-500 transition"
            >
              Start Internship
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
