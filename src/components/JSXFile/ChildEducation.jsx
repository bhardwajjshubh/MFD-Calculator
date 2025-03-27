import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../CSSFile/Common.css";
import Footer from "./Footer";

const ChildEducation = ({ selectedImage }) => {
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(1);
  const [higherEducationAge, setHigherEducationAge] = useState(18);
  const [currentCost, setCurrentCost] = useState("");
  const [currentInvestment, setCurrentInvestment] = useState("");
  const [inflation, setInflation] = useState(11);
  const [returnExisting, setReturnExisting] = useState(4);
  const [returnNew, setReturnNew] = useState(4);
  const [calculationResults, setCalculationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateEducation = () => {
    const yearsToEducation = higherEducationAge - childAge;
    const inflationRate = inflation / 100;
    const futureCost =
      parseFloat(currentCost) * Math.pow(1 + inflationRate, yearsToEducation);
    const existingReturnRate = returnExisting / 100;
    const futureExistingValue =
      parseFloat(currentInvestment) * Math.pow(1 + existingReturnRate, yearsToEducation);
    const amountNeeded = futureCost - futureExistingValue;
    const newReturnRate = returnNew / 100;
    const monthlyReturnRate = newReturnRate / 12;
    const numberOfMonths = yearsToEducation * 12;
    let monthlySavings = 0;
    if (amountNeeded > 0) {
      monthlySavings =
        amountNeeded *
        (monthlyReturnRate / (Math.pow(1 + monthlyReturnRate, numberOfMonths) - 1));
    }
    setCalculationResults({
      futureCost: futureCost.toFixed(0),
      futureExistingValue: futureExistingValue.toFixed(0),
      deficit: amountNeeded.toFixed(0),
      lumpsum: (amountNeeded / Math.pow(1 + newReturnRate, yearsToEducation)).toFixed(0),
      sip: monthlySavings.toFixed(0),
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
  
        pdf.save("Child_Education_calculation.pdf");
  
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


  // Result section
  return (
    <div className="container">
      <div className="content">
        <h2>Child Education Calculator</h2>

        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="parent-name">Parent Name</label>
            <input
              type="text"
              id="parent-name"
              name="parent-name"
              placeholder="Parent Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="child-name">Child Name</label>
            <input
              type="text"
              id="child-name"
              name="child-name"
              placeholder="Child Name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="child-age">Child age</label>
            <div className="slider-container">
              <input
                type="range"
                id="child-age"
                name="child-age"
                min="1"
                max="18"
                value={childAge}
                onChange={(e) => setChildAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{childAge}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="higher-education-age">Higher education age</label>
            <div className="slider-container">
              <input
                type="range"
                id="higher-education-age"
                name="higher-education-age"
                min="17"
                max="30"
                value={higherEducationAge}
                onChange={(e) => setHigherEducationAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{higherEducationAge}</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="current-cost">Current cost of higher education</label>
            <input
              type="number"
              id="current-cost"
              name="current-cost"
              placeholder="Current cost of higher education"
              value={currentCost}
              onChange={(e) => setCurrentCost(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="current-investment">Current investment for the goal</label>
            <input
              type="number"
              id="current-investment"
              name="current-investment"
              placeholder="Current investment for the goal"
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
                name="inflation"
                min="1"
                max="20"
                value={inflation}
                onChange={(e) => setInflation(parseInt(e.target.value))}
              />
              <span className="slider-value">{inflation}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="return-existing">Return on existing investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-existing"
                name="return-existing"
                min="1"
                max="20"
                value={returnExisting}
                onChange={(e) => setReturnExisting(parseInt(e.target.value))}
              />
              <span className="slider-value">{returnExisting}</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="return-new">Return on new investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-new"
                name="return-new"
                min="1"
                max="20"
                value={returnNew}
                onChange={(e) => setReturnNew(parseInt(e.target.value))}
              />
              <span className="slider-value">{returnNew}</span>
            </div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateEducation}>
          Calculate
        </button>

        {showResults && calculationResults && (
          <div id="results-container" className="results-container">
            <div className="results-header">
              Dear {parentName}
              <br />
              Dream Education Planning
            </div>

            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}

            <table className="results-table">
              <tbody>
                <tr>
                  <td>Child name</td>
                  <td>{childName}</td>
                </tr>
                <tr>
                  <td>Child age</td>
                  <td>{childAge} years</td>
                </tr>
                <tr>
                  <td>Higher education age</td>
                  <td>{higherEducationAge} years</td>
                </tr>
                <tr>
                  <td>Current cost of higher education</td>
                  <td>Rs. {currentCost}</td>
                </tr>
                <tr>
                  <td>Inflation</td>
                  <td>{inflation}%</td>
                </tr>
                <tr>
                  <td>Current investment for the goal</td>
                  <td>Rs. {currentInvestment}</td>
                </tr>
                <tr>
                  <td>Return on existing investment</td>
                  <td>{returnExisting}%</td>
                </tr>
                <tr>
                  <td>Return on new investment</td>
                  <td>{returnNew}%</td>
                </tr>
              </tbody>
            </table>

            <div className="results-section">
              Calculation based on above assumptions
            </div>

            <table className="results-table">
              <tbody>
                <tr>
                  <td>Future value of education funding</td>
                  <td>Rs. {calculationResults.futureCost}</td>
                </tr>
                <tr>
                  <td>Future value of your existing investment</td>
                  <td>Rs. {calculationResults.futureExistingValue}</td>
                </tr>
                <tr>
                  <td>Deficit for which you need to start investing</td>
                  <td>Rs. {calculationResults.deficit}</td>
                </tr>
              </tbody>
            </table>

            <div className="results-section">Option 1</div>
            <table className="results-table">
              <tbody>
                <tr>
                  <td>Lumpsum investment require to achieve goal</td>
                  <td>Rs. {calculationResults.lumpsum}</td>
                </tr>
              </tbody>
            </table>

            <div className="results-section">Option 2</div>
            <table className="results-table">
              <tbody>
                <tr>
                  <td>SIP require to achieve goal</td>
                  <td>Rs. {calculationResults.sip}</td>
                </tr>
              </tbody>
            </table>
            {/* Add your footer content here (AutoWealth.in, Disclaimer) */}
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

export default ChildEducation;
