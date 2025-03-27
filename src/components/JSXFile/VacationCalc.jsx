import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const VacationCalculator = ({selectedImage}) => {
  const [name, setName] = useState("");
  const [placeToVisit, setPlaceToVisit] = useState("");
  const [years, setYears] = useState(1);
  const [currentCost, setCurrentCost] = useState("");
  const [currentInvestment, setCurrentInvestment] = useState("");
  const [inflation, setInflation] = useState(4);
  const [returnOnExisting, setReturnOnExisting] = useState(4);
  const [returnOnNew, setReturnOnNew] = useState(4);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateGoal = () => {
    // Implement your calculation logic here
    // This is a placeholder for the actual calculation
    const futureValue = currentInvestment * (1 + returnOnNew / 100) * years;
    setCalculationResults({
      futureValue: futureValue.toFixed(2),
      totalInvestment: currentInvestment,
      totalInterest: (futureValue - currentInvestment).toFixed(2),
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
  
        pdf.save("Vacation_calculation.pdf");
  
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
    <h2>Vacation Calculator</h2>
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
        <label htmlFor="place-to-visit">Place to visit</label>
        <input
          type="text"
          id="place-to-visit"
          value={placeToVisit}
          onChange={(e) => setPlaceToVisit(e.target.value)}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="years">After how many years?</label>
        <div className="slider-container">
          <input
            type="range"
            id="years"
            min="1"
            max="30"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
          />
          <span className="slider-value">{years}</span>
        </div>
      </div>
      <div className="form-group"> {/* Added for consistent structure */}
          {/* Empty div, or could add an empty form group if needed */}
      </div>
    </div>
    <div className="form-row">
      <div className="pair-group">
        <label htmlFor="current-cost">Current cost of goal</label>
        <input
          type="number"
          id="current-cost"
          value={currentCost}
          onChange={(e) => setCurrentCost(e.target.value)}
        />
      </div>
      <div className="pair-group">
        <label htmlFor="current-investment">Current investment for the goal</label>
        <input
          type="number"
          id="current-investment"
          value={currentInvestment}
          onChange={(e) => setCurrentInvestment(e.target.value)}
        />
      </div>
    </div>
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
            onChange={(e) => setInflation(parseInt(e.target.value))}
          />
          <span className="slider-value">{inflation}</span>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="return-on-existing">Return on existing investment (%)</label>
        <div className="slider-container">
          <input
            type="range"
            id="return-on-existing"
            min="1"
            max="20"
            value={returnOnExisting}
            onChange={(e) => setReturnOnExisting(parseInt(e.target.value))}
          />
          <span className="slider-value">{returnOnExisting}</span>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="return-on-new">Return on new investment (%)</label>
        <div className="slider-container">
          <input
            type="range"
            id="return-on-new"
            min="1"
            max="20"
            value={returnOnNew}
            onChange={(e) => setReturnOnNew(parseInt(e.target.value))}
          />
          <span className="slider-value">{returnOnNew}</span>
        </div>
      </div>
    </div>
    <button className="calculate-btn" onClick={calculateGoal}>
      Calculate
    </button>

    {calculationResults && (
      <div className="results-container">
        <div className="results-header">
          Dear {name}
          <br />
          Vacation Investment Plan
        </div>

        {selectedImage && (
          <div className="image-container">
            <img src={selectedImage} alt="Selected" />
          </div>
        )}

        <table className="results-table">
          <tbody>
            <tr>
              <td>Place to visit</td>
              <td>{placeToVisit}</td>
            </tr>
            <tr>
              <td>After how many years?</td>
              <td>{years} years</td>
            </tr>
            <tr>
              <td>Current cost of goal</td>
              <td>Rs. {currentCost}</td>
            </tr>
            <tr>
              <td>Current Investment</td>
              <td>Rs. {currentInvestment}</td>
            </tr>
            <tr>
              <td>Future Value of Investment</td>
              <td>Rs. {calculationResults.futureValue}</td>
            </tr>
            <tr>
              <td>Total Investment</td>
              <td>Rs. {calculationResults.totalInvestment}</td>
            </tr>
            <tr>
              <td>Total Interest Earned</td>
              <td>Rs. {calculationResults.totalInterest}</td>
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

export default VacationCalculator;
