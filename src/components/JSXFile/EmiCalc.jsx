import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "./Footer";

const EmiCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState(1);
  const [interestRate, setInterestRate] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = interestRate / 100 / 12;
    const time = tenure * 12;
    const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    setCalculationResults({
      emi: emi.toFixed(2),
      totalInterest: (emi * time - principal).toFixed(2),
      totalAmount: (emi * time).toFixed(2),
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
  
        pdf.save("Emi_calculation.pdf");
  
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
        <h2>EMI Calculator</h2>

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
            <label htmlFor="loan-amount">Loan Amount</label>
            <input
              type="number"
              id="loan-amount"
              name="loan-amount"
              placeholder="Loan Amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tenure">Tenure (years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="tenure"
                name="tenure"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
              />
              <span className="slider-value">{tenure}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="interest-rate">Interest Rate (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="interest-rate"
                name="interest-rate"
                min="1"
                max="20"
                value={interestRate}
                onChange={(e) => setInterestRate(parseInt(e.target.value))}
              />
              <span className="slider-value">{interestRate}</span>
            </div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateEMI}>
          Calculate
        </button>

        {showResults && calculationResults && (
          <div id="results-container" className="results-container">
            <div className="results-header">
              Dear {name}
              <br />
              EMI Calculation Results
            </div>
            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}
            <table className="results-table">
              <tbody>
                <tr>
                  <td>Loan Amount</td>
                  <td>Rs. {loanAmount}</td>
                </tr>
                <tr>
                  <td>Tenure</td>
                  <td>{tenure} years</td>
                </tr>
                <tr>
                  <td>Interest Rate</td>
                  <td>{interestRate}%</td>
                </tr>
                <tr>
                  <td>EMI</td>
                  <td>Rs. {calculationResults.emi}</td>
                </tr>
                <tr>
                  <td>Total Interest</td>
                  <td>Rs. {calculationResults.totalInterest}</td>
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

export default EmiCalc;
