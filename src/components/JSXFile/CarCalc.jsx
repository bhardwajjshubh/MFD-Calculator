import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";
import "../CSSFile/Common.css";


const CarCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [dreamCarName, setDreamCarName] = useState("");
  const [years, setYears] = useState(1);
  const [currentCost, setCurrentCost] = useState("");
  const [currentInvestment, setCurrentInvestment] = useState("");
  const [inflation, setInflation] = useState(4);
  const [returnOnExisting, setReturnOnExisting] = useState(4);
  const [returnOnNew, setReturnOnNew] = useState(4);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateFutureCost = () => {
    const futureCost = currentCost * Math.pow(1 + inflation / 100, years);
    const futureInvestmentValue = currentInvestment * Math.pow(1 + returnOnExisting / 100, years);
    const additionalInvestmentNeeded = futureCost - futureInvestmentValue;
    const futureValueOfNewInvestment = additionalInvestmentNeeded * Math.pow(1 + returnOnNew / 100, years);

    setCalculationResults({
      futureCost: futureCost.toFixed(2),
      futureInvestmentValue: futureInvestmentValue.toFixed(2),
      additionalInvestmentNeeded: additionalInvestmentNeeded.toFixed(2),
      futureValueOfNewInvestment: futureValueOfNewInvestment.toFixed(2),
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
  
        pdf.save("Car_calculation.pdf");
  
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
        <h2>Dream Car Calculator</h2>

        {/* Name & Car Name Inputs */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dream-car-name">Dream Car Name</label>
            <input
              type="text"
              id="dream-car-name"
              value={dreamCarName}
              onChange={(e) => setDreamCarName(e.target.value)}
            />
          </div>
        </div>

        {/* Loan Details Inputs */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="current-cost">Current Cost of Goal (₹)</label>
            <input
              type="number"
              id="current-cost"
              value={currentCost}
              onChange={(e) => setCurrentCost(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="current-investment">Current Investment (₹)</label>
            <input
              type="number"
              id="current-investment"
              value={currentInvestment}
              onChange={(e) => setCurrentInvestment(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="years">After how many years?</label>
            <div className="slider-container">
              <input
                type="range"
                id="years"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <span className="slider-value">{years}</span>
            </div>
          </div>
        </div>

        {/* Sliders for Rates */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="inflation">Inflation (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="inflation"
                min="1"
                max="20"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
              />
              <span className="slider-value">{inflation}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="return-existing">Return on Existing Investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-existing"
                min="1"
                max="20"
                value={returnOnExisting}
                onChange={(e) => setReturnOnExisting(Number(e.target.value))}
              />
              <span className="slider-value">{returnOnExisting}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="return-new">Return on New Investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-new"
                min="1"
                max="20"
                value={returnOnNew}
                onChange={(e) => setReturnOnNew(Number(e.target.value))}
              />
              <span className="slider-value">{returnOnNew}</span>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button className="calculate-btn" onClick={calculateFutureCost}>
          Calculate
        </button>

        {/* Display Results */}
        {calculationResults && (
  <div className="results-container">
    <div className="results-header"> {/* Use results-header for consistent header */}
      <h3>Dream Car Investment Plan</h3> {/* Use h3 for consistent heading */}
      <p>Dear {name}, here are your investment details:</p>
    </div>

    {selectedImage && (
      <div className="image-container">
        <img src={selectedImage} alt="Selected Car" />
      </div>
    )}

    <table className="results-table">
      <tbody>
        <tr>
          <td>Dream Car Name</td>
          <td>{dreamCarName}</td>
        </tr>
        <tr>
          <td>Years</td>
          <td>{years} years</td>
        </tr>
        <tr>
          <td>Current Cost</td>
          <td>₹{calculationResults.futureCost}</td>
        </tr>
        <tr>
          <td>Current Investment</td>
          <td>₹{calculationResults.futureInvestmentValue}</td>
        </tr>
        <tr>
          <td>Future Cost</td>
          <td>₹{calculationResults.futureCost}</td>
        </tr>
        <tr>
          <td>Future Investment Value</td>
          <td>₹{calculationResults.futureInvestmentValue}</td>
        </tr>
        <tr>
          <td>Additional Investment Needed</td>
          <td>₹{calculationResults.additionalInvestmentNeeded}</td>
        </tr>
        <tr>
          <td>Future Value of New Investment</td>
          <td>₹{calculationResults.futureValueOfNewInvestment}</td>
        </tr>
      </tbody>
    </table>
    {isGeneratingPDF && <Footer />}
            {/* Download PDF Button */}
            <button className="calculate-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCalc;
