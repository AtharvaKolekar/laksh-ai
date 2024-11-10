"use client";
import { Button } from "antd";
import { useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib"; // Import pdf-lib

export default function CertificateCanvasPage({
    name = "Name", course = "Course", certID = "67854r5452"
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

    const downloadPDF = async () => {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a page to the document with the size 1600x1000px (converted to mm)
        const page = pdfDoc.addPage([423.2, 264.5]); // 1600px x 1000px converted to mm

        // Get the canvas image as PNG
        const canvas = canvasRef.current;
        const imgData = canvas.toDataURL("image/png");

        // Embed the PNG image into the PDF
        const img = await pdfDoc.embedPng(imgData);
        const imgDims = img.scale(1); // Scale the image appropriately

        // Calculate the position and size of the image in the PDF
        const imageWidth = 423.2; // Width in mm (to match page size)
        const imageHeight = (imgDims.height / imgDims.width) * imageWidth;

        // Draw the image on the page
        page.drawImage(img, {
            x: 0,
            y: page.getHeight() - imageHeight, // Position the image at the top
            width: imageWidth,
            height: imageHeight,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Download the PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = "certificate.pdf";
        link.click();
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
            <Button onClick={downloadPDF} style={{ marginTop: "20px" }}>
                Download Certificate as PDF
            </Button>
        </div>
    );
}
