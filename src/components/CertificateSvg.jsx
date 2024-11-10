import React, { useEffect, useRef } from "react";

const CertificateCanvas = () => {
  const canvasRef = useRef(null);
  const name = "Saniya Shaikh";
  const course = "Cybersecurity";
  const start = "October 2024";
  const end = "December 2024";
  const certID = "67854r5452";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.src = "/cert.png";
    background.onload = () => {
      // Draw background image
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Set text properties and draw text
      ctx.textAlign = "center";

      ctx.font = "2.1rem Arial";
      ctx.fillStyle = "black";
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

      ctx.font = "2.1rem Arial";
      ctx.fillText(
        `from ${start} to ${end} with LakshAI.`,
        canvas.width / 2,
        690
      );

      ctx.font = "1.3rem Arial";
      ctx.textAlign = "left";
      ctx.fillText("Cert-ID: " + certID, 20, canvas.height - 20);
    };
  }, [name, course, start, end, certID]); // Dependencies if any data changes

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="certificateCanvas"
        width="1600"
        height="1000"
        style={{ width: "800px", height: "500px", border: "1px solid #ccc" }}
      ></canvas>
    </div>
  );
};

export default CertificateCanvas;
