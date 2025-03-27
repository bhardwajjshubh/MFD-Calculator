import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "./Footer";

const WeddingPlanner = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(1);
  const [marriageAge, setMarriageAge] = useState(21);
  const [costOfMarriage, setCostOfMarriage] = useState("");
  const [investment, setInvestment] = useState("");
  const [inflation, setInflation] = useState(4);
  const [returnExisting, setReturnExisting] = useState(4);
  const [returnNew, setReturnNew] = useState(4);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculatePlan = () => {
    const yearsLeft = marriageAge - childAge;
    const cost = parseFloat(costOfMarriage);
    const futureMarriageCost = cost * Math.pow(1 + inflation / 100, yearsLeft);
    setCalculationResults({ futureCost: futureMarriageCost.toFixed(2), yearsLeft });
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

      pdf.save("Wedding_calculation.pdf");

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
      <h2>Wedding Planner</h2>
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
          <label htmlFor="child-name">Child Name</label>
          <input
            type="text"
            id="child-name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="child-age">Child Age</label>
          <div className="slider-container">
            <input
              type="range"
              id="child-age"
              min="1"
              max="18"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
            <span className="slider-value">{childAge}</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="marriage-age">Marriage Age</label>
          <div className="slider-container">
            <input
              type="range"
              id="marriage-age"
              min="18"
              max="30"
              value={marriageAge}
              onChange={(e) => setMarriageAge(e.target.value)}
            />
            <span className="slider-value">{marriageAge}</span>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="pair-group">
          <label htmlFor="cost-marriage">Current Cost of Marriage</label>
          <input
            type="number"
            id="cost-marriage"
            value={costOfMarriage}
            onChange={(e) => setCostOfMarriage(e.target.value)}
          />
        </div>
        <div className="pair-group">
          <label htmlFor="investment">Current Investment for the Goal</label>
          <input
            type="number"
            id="investment"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
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
              max="10"
              value={inflation}
              onChange={(e) => setInflation(e.target.value)}
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
              max="15"
              value={returnExisting}
              onChange={(e) => setReturnExisting(e.target.value)}
            />
            <span className="slider-value">{returnExisting}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="return-new">Return on New Investment (%)</label>
        <div className="slider-container">
          <input
            type="range"
            id="return-new"
            min="1"
            max="15"
            value={returnNew}
            onChange={(e) => setReturnNew(e.target.value)}
          />
          <span className="slider-value">{returnNew}</span>
        </div>
      </div>

      <button className="calculate-btn" onClick={calculatePlan}>
        Calculate
      </button>

      {calculationResults && (
        <div className="results-container">
          <div className="results-header">
            Dear {name}
            <br />
            Wedding Planning
          </div>

          {selectedImage && (
            <div className="image-container">
              <img src={selectedImage} alt="Selected" />
            </div>
          )}

          <table className="results-table">
            <tbody>
              <tr>
                <td>Child Name</td>
                <td>{childName}</td>
              </tr>
              <tr>
                <td>Child Age</td>
                <td>{childAge} years</td>
              </tr>
              <tr>
                <td>Marriage Age</td>
                <td>{marriageAge} years</td>
              </tr>
              <tr>
                <td>Years Left</td>
                <td>{calculationResults.yearsLeft} years</td>
              </tr>
              <tr>
                <td>Current Cost of Marriage</td>
                <td>Rs. {costOfMarriage}</td>
              </tr>
              <tr>
                <td>Future Cost of Marriage</td>
                <td>Rs. {calculationResults.futureCost}</td>
              </tr>
              <tr>
                <td>Current Investment</td>
                <td>Rs. {investment}</td>
              </tr>
              <tr>
                <td>Inflation</td>
                <td>{inflation}%</td>
              </tr>
              <tr>
                <td>Return on Existing Investment</td>
                <td>{returnExisting}%</td>
              </tr>
              <tr>
                <td>Return on New Investment</td>
                <td>{returnNew}%</td>
              </tr>
              <tr>
                <td>Result</td>
                <td>
                  {calculationResults.futureCost &&
                  calculationResults.yearsLeft ? (
                    `Future Cost is Rs. ${calculationResults.futureCost}, and the marriage will happen in ${calculationResults.yearsLeft} years.`
                  ) : (
                    "Calculation not completed"
                  )}
                </td>
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

export default WeddingPlanner;