"use client";
import { Button } from "antd";
import { useEffect, useRef } from "react";

export default function CertificateCanvasPage({
    name="Name", course="Course", certID = "67854r5452"
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        const start = "November 2024";
        const end = "December 2024";
       

        const background = new Image();
        background.src = "/cert.png";
        background.onload = () => {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.font = "2.1rem Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(
                "This Internship Simulation Program certificate is proudly awarded to",
                canvas.width / 2,
                410
            );

            ctx.font = "bold 4rem Arial";
            ctx.fillStyle = "violet";
            ctx.fillText(name, canvas.width / 2, 495);

            ctx.font = "2.1rem Arial";
            ctx.fillStyle = "black";
            ctx.fillText(
                "For their exceptional performance and successful completion of",
                canvas.width / 2,
                590
            );

            ctx.font = "bold 2.1rem Arial";
            ctx.fillText(course + " Internship Simulation", canvas.width / 2, 640);

            ctx.fillText("from " + start + " to " + end + " with LakshAI.", canvas.width / 2, 690);

            ctx.font = "1.3rem Arial";
            ctx.textAlign = "left";
            ctx.fillText("Cert-ID: " + certID, 20, canvas.height - 20);
        };
    }, []);

    // Function to download the canvas as a PDF with 1600x1000 page size
    const downloadPDF = () => {
        const jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF({
            orientation: "landscape", // optional, adjust as needed
            unit: "mm", // units in millimeters
            format: [423.2, 264.5], // width and height in mm (converted from 1600x1000px)
        });

        const canvas = canvasRef.current;
        const imgData = canvas.toDataURL("image/png");

        // Add the canvas image to the PDF with the correct size
        doc.addImage(imgData, "PNG", 10, 10, 403.2, 253.5); // Adjust the image size inside PDF
        doc.save("certificate.pdf");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className="m-2 mt-5 font-semibold text-indigo-600 text-xl">Certificate of Completion</h1>
            <canvas
                ref={canvasRef}
                id="certificateCanvas"
                width="1600"
                height="1000"
                style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid #ccc",
                }}
            ></canvas>
            <br />
            <Button onClick={downloadPDF} style={{ marginTop: "20px" }} >
                Download Certificate as PDF
            </Button>

            {/* Importing jsPDF library via script tag */}
          
        </div>
    );
}
