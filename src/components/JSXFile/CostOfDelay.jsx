import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const CostOfDelay = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [delayYears, setDelayYears] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateCostOfDelay = () => {
    const annualReturnRate = expectedReturn / 100;
    const futureValueWithoutDelay = investmentAmount * Math.pow(1 + annualReturnRate, 30);
    const futureValueWithDelay = investmentAmount * Math.pow(1 + annualReturnRate, 30 - delayYears);
    const lossDueToDelay = futureValueWithoutDelay - futureValueWithDelay;

    setCalculationResults({
      futureValueWithoutDelay: futureValueWithoutDelay.toFixed(2),
      futureValueWithDelay: futureValueWithDelay.toFixed(2),
      lossDueToDelay: lossDueToDelay.toFixed(2),
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
  
        pdf.save("Cost_Delay_calculation.pdf");
  
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
        <h2>Cost of Delay Calculator</h2>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="investment-amount">Investment Amount</label>
            <input
              type="text"
              id="investment-amount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="delay-years">Delay in Years</label>
            <div className="slider-container">
              <input
                type="range"
                id="delay-years"
                min="1"
                max="30"
                value={delayYears}
                onChange={(e) => setDelayYears(parseInt(e.target.value))}
              />
              <span className="slider-value">{delayYears}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="expected-return">Expected Return (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="expected-return"
                min="1"
                max="20"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseInt(e.target.value))}
              />
              <span className="slider-value">{expectedReturn}</span>
            </div>
          </div>
        </div>
        <button className="calculate-btn" onClick={calculateCostOfDelay}>
          Calculate
        </button>
        {calculationResults && (
          <div className="results-container" id="results-container">
            <h3>Results</h3>
            <div className="results-header">
              Dear {name}
              <br />
              Cost of Delay Analysis
            </div>

            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}

            <table className="results-table">
              <tbody>
                <tr>
                  <td>Investment-Amount</td>
                  <td>Rs. {investmentAmount}</td>
                </tr>
                <tr>
                  <td>Delays-In-Years</td>
                  <td>Rs. {delayYears}</td>
                </tr>
                <tr>
                  <td>Expected Return (%)</td>
                  <td>Rs. {expectedReturn}</td>
                </tr>
                <tr>
                  <td>Future Value without Delay</td>
                  <td>Rs. {calculationResults.futureValueWithoutDelay}</td>
                </tr>
                <tr>
                  <td>Future Value with Delay</td>
                  <td>Rs. {calculationResults.futureValueWithDelay}</td>
                </tr>
                <tr>
                  <td>Loss Due to Delay</td>
                  <td>Rs. {calculationResults.lossDueToDelay}</td>
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

export default CostOfDelay;