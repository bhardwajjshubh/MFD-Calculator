import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Footer from "./Footer"; // Import your Footer component

const SipCalculator = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [sipAmount, setSipAmount] = useState("");
  const [noOfYears, setNoOfYears] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const calculateSip = () => {
    const monthlyReturnRate = expectedReturn / 100 / 12;
    const totalMonths = noOfYears * 12;
    const futureValue =
      sipAmount *
      ((Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate);
    setCalculationResults({
      futureValue: futureValue.toFixed(2),
      totalInvestment: (sipAmount * totalMonths).toFixed(2),
      totalInterest: (futureValue - sipAmount * totalMonths).toFixed(2),
    });
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
  
        pdf.save("Sip_calculation.pdf");
  
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
        <h2>SIP Calculator</h2>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="pair-group">
            <label htmlFor="sip-amount">SIP Amount (Monthly)</label>
            <input type="number" id="sip-amount" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="no-of-years">Number of Years</label>
            <div className="slider-container">
              <input type="range" id="no-of-years" min="1" max="30" value={noOfYears} onChange={(e) => setNoOfYears(parseInt(e.target.value))} />
              <span className="slider-value">{noOfYears}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="expected-return">Expected Return (%)</label>
            <div className="slider-container">
              <input type="range" id="expected-return" min="1" max="20" value={expectedReturn} onChange={(e) => setExpectedReturn(parseInt(e.target.value))} />
              <span className="slider-value">{expectedReturn}</span>
            </div>
          </div>
        </div>
        <button className="calculate-btn" onClick={calculateSip}>Calculate</button>

        {calculationResults && (
          <div className="results-container">
            <div className="results-header">
              Dear {name}
              <br />
              SIP Investment Plan
            </div>

            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}

            <table className="results-table">
              <tbody>
                <tr><td>Monthly SIP Amount</td><td>Rs. {sipAmount}</td></tr>
                <tr><td>Number of Years</td><td>{noOfYears} years</td></tr>
                <tr><td>Expected Return Rate</td><td>{expectedReturn}%</td></tr>
                <tr><td>Future Value of Investment</td><td>Rs. {calculationResults.futureValue}</td></tr>
                <tr><td>Total Investment</td><td>Rs. {calculationResults.totalInvestment}</td></tr>
                <tr><td>Total Interest Earned</td><td>Rs. {calculationResults.totalInterest}</td></tr>
              </tbody>
            </table>

            {isGeneratingPDF && <Footer />} {/* Footer appears only when generating PDF */}

            <button className="calculate-btn" onClick={downloadPDF}>Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SipCalculator;
