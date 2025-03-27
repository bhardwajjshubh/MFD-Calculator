import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const LimitedSipCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [monthlyInvestAmount, setMonthlyInvestAmount] = useState("");
  const [limitedTerm, setLimitedTerm] = useState(1);
  const [totalHorizon, setTotalHorizon] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculate = () => {
    const monthlyInvestment = parseFloat(monthlyInvestAmount) || 0;
    const termYears = parseInt(limitedTerm, 10) || 0;
    const horizonYears = parseInt(totalHorizon, 10) || 0;
    const returnRate = parseFloat(expectedReturn) || 0;

    const monthlyReturnRate = returnRate / 100 / 12;
    const totalMonths = horizonYears * 12;
    const termMonths = termYears * 12;

    // Calculate future value of the SIP
    let futureValue = 0;
    for (let month = 0; month < termMonths; month++) {
      futureValue += monthlyInvestment * Math.pow(1 + monthlyReturnRate, totalMonths - month);
    }

    setCalculationResults({
      futureValue: futureValue.toFixed(2),
      totalInvestment: (monthlyInvestment * termMonths).toFixed(2),
      totalInterest: (futureValue - monthlyInvestment * termMonths).toFixed(2),
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
  
        pdf.save("Limited_sip_calculation.pdf");
  
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
        <h2>Limited Term SIP Calculator</h2>
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
            <label htmlFor="monthly-invest-amount">Monthly Invest Amount</label>
            <input
              type="number"
              id="monthly-invest-amount"
              value={monthlyInvestAmount}
              onChange={(e) => setMonthlyInvestAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="limited-term">Limited Investment Term (Years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="limited-term"
                min="1"
                max="30"
                value={limitedTerm}
                onChange={(e) => setLimitedTerm(parseInt(e.target.value))}
              />
              <span className="slider-value">{limitedTerm}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="total-horizon">Total Investment Horizon (Years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="total-horizon"
                min="1"
                max="30"
                value={totalHorizon}
                onChange={(e) => setTotalHorizon(parseInt(e.target.value))}
              />
              <span className="slider-value">{totalHorizon}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expected-return">Expected Rate of Return (%)</label>
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
        <button className="calculate-btn" onClick={calculate}>
          Calculate
        </button>

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
                <tr>
                  <td>Monthly SIP Amount</td>
                  <td>Rs. {monthlyInvestAmount}</td>
                </tr>
                <tr>
                  <td>Limited Investment Term</td>
                  <td>{limitedTerm} years</td>
                </tr>
                <tr>
                  <td>Total Investment Horizon</td>
                  <td>{totalHorizon} years</td>
                </tr>
                <tr>
                  <td>Expected Return Rate</td>
                  <td>{expectedReturn}%</td>
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

export default LimitedSipCalc;
