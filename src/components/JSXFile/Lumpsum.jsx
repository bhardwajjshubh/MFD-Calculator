import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "./Footer";

const SimpleInterestCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [time, setTime] = useState(1);
  const [rate, setRate] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateSimpleInterest = () => {
    const principal = parseFloat(principalAmount);
    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;
    setCalculationResults({
      interest: interest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    });
    setShowResults(true);
  };

  const downloadPDF = () => {
    setIsGeneratingPDF(true);
  
    setTimeout(() => {
      const input = document.querySelector(".results-container");
      const downloadButton = input.querySelector(".calculate-btn");
  
      if (!input) {
        console.error("Results container not found");
        setIsGeneratingPDF(false);
        return;
      }
  
      if (downloadButton) {
        downloadButton.classList.add("hide-download-btn");
      }
  
      html2canvas(input, {
        scale: 1.5, // Middle ground for quality
        useCORS: true,
        scrollY: 0,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Middle ground for JPEG quality
  
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
          compress: true,
        });
  
        const pageWidth = pdf.internal.pageSize.getWidth();
  
        // Adjust these values to decrease width and increase height
        const imgWidth = pageWidth - 60; // Further reduced image width
        const imgHeight = (canvas.height / canvas.width) * imgWidth * 1.2; // Increased height
  
        const xOffset = (pageWidth - imgWidth) / 2; // Center horizontally
        const yOffset = 20; // Top margin
  
        pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
  
        pdf.save("Lumpsum_calculation.pdf");
  
        if (downloadButton) {
          downloadButton.classList.remove("hide-download-btn");
        }
        setIsGeneratingPDF(false);
      }).catch((error) => {
        console.error("Error generating PDF:", error);
        if (downloadButton) {
          downloadButton.classList.remove("hide-download-btn");
        }
        setIsGeneratingPDF(false);
      });
    }, 500);
  };
  

  return (
    <div className="container">
      <div className="content">
        <h2>LumpSum Calculator</h2>

        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="principal-amount">Principal Amount</label>
            <input
              type="number"
              id="principal-amount"
              name="principal-amount"
              placeholder="Principal Amount"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="time">Time (years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="time"
                name="time"
                min="1"
                max="30"
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value))}
              />
              <span className="slider-value">{time}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="rate">Rate of Interest (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="rate"
                name="rate"
                min="1"
                max="20"
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
              />
              <span className="slider-value">{rate}</span>
            </div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateSimpleInterest}>
          Calculate
        </button>

        {showResults && calculationResults && (
          <div id="results-container" className="results-container">
            <div className="results-header">
              Dear {name}
              <br />
              Simple Interest Calculation Results
            </div>
            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}
            <table className="results-table">
              <tbody>
                <tr>
                  <td>Principal Amount</td>
                  <td>Rs. {principalAmount}</td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>{time} years</td>
                </tr>
                <tr>
                  <td>Rate of Interest</td>
                  <td>{rate}%</td>
                </tr>
                <tr>
                  <td>Simple Interest</td>
                  <td>Rs. {calculationResults.interest}</td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td>Rs. {calculationResults.totalAmount}</td>
                </tr>
              </tbody>
            </table>
            {isGeneratingPDF && <Footer />}
            <button className="calculate-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleInterestCalc;
