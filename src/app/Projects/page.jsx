import React from "react";

function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
       
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: "600",
          color: "#23f",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Welcome to Projects Portal
      </div>

      <div
        style={{
          fontSize: "20px",
          color: "#2d3748",
          marginBottom: "10px",
        }}
      >
        I Am A
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        {/* Business finding Interns */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "150px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#4a5568", marginBottom: "10px" }}
          >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
          </svg>
          <h2 style={{ fontSize: "16px", fontWeight: "500", color: "#2d3748" }}>
            Business finding Intern 
          </h2>
        </div>

        {/* Intern Finding Project */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "150px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#4a5568", marginBottom: "10px" }}
          >
            <path d="M12 12h.01" />
            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <path d="M22 13a18.15 18.15 0 0 1-20 0" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
          <h2 style={{ fontSize: "16px", fontWeight: "500", color: "#2d3748" }}>
            Intern Finding Project
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Page;
