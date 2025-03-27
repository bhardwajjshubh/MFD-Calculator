import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const RetirementCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState("");
  const [existingInvestment, setExistingInvestment] = useState("");
  const [currentAge, setCurrentAge] = useState(1);
  const [retirementAge, setRetirementAge] = useState(18);
  const [lifeExpectancy, setLifeExpectancy] = useState(18);
  const [inflation, setInflation] = useState(4);
  const [postRetirementInflation, setPostRetirementInflation] = useState(4);
  const [postRetirementRiskFreeRate, setPostRetirementRiskFreeRate] = useState(4);
  const [returnOnExistingInvestment, setReturnOnExistingInvestment] = useState(4);
  const [returnOnNewInvestment, setReturnOnNewInvestment] = useState(4);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculate = () => {
    const monthlyExpenses = parseFloat(currentMonthlyExpenses) || 0;
    const investment = parseFloat(existingInvestment) || 0;
    const age = parseInt(currentAge, 10) || 0;
    const retireAge = parseInt(retirementAge, 10) || 0;
    const expectancy = parseInt(lifeExpectancy, 10) || 0;
    const infl = parseFloat(inflation) || 0;
    const postInfl = parseFloat(postRetirementInflation) || 0;
    const riskFreeRate = parseFloat(postRetirementRiskFreeRate) || 0;
    const existingReturn = parseFloat(returnOnExistingInvestment) || 0;
    const newReturn = parseFloat(returnOnNewInvestment) || 0;

    const yearsToRetirement = retireAge - age;
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + infl / 100, yearsToRetirement);
    const totalRetirementExpenses = futureMonthlyExpenses * 12 * (expectancy - retireAge);
    const futureInvestmentValue = investment * Math.pow(1 + existingReturn / 100, yearsToRetirement);
    const additionalAmountNeeded = totalRetirementExpenses - futureInvestmentValue;
    const monthlySavingsRequired = additionalAmountNeeded / (12 * yearsToRetirement);

    setCalculationResults({
      futureMonthlyExpenses: futureMonthlyExpenses.toFixed(2),
      totalRetirementExpenses: totalRetirementExpenses.toFixed(2),
      futureInvestmentValue: futureInvestmentValue.toFixed(2),
      additionalAmountNeeded: additionalAmountNeeded.toFixed(2),
      monthlySavingsRequired: monthlySavingsRequired.toFixed(2),
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
  
        pdf.save("Retirement_calculation.pdf");
  
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
        <h2>Retirement Calculator</h2>
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
            <label htmlFor="current-monthly-expenses">Current Monthly Expenses</label>
            <input
              type="number"
              id="current-monthly-expenses"
              value={currentMonthlyExpenses}
              onChange={(e) => setCurrentMonthlyExpenses(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="existing-investment">Existing Investment</label>
            <input
              type="number"
              id="existing-investment"
              value={existingInvestment}
              onChange={(e) => setExistingInvestment(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="current-age">Current Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="current-age"
                min="1"
                max="100"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{currentAge}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="retirement-age">Retirement Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="retirement-age"
                min="18"
                max="70"
                value={retirementAge}
                onChange={(e) => setRetirementAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{retirementAge}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="life-expectancy">Life Expectancy (Years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="life-expectancy"
                min="18"
                max="100"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
              />
              <span className="slider-value">{lifeExpectancy}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="inflation">Inflation (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="inflation"
                min="0"
                max="10"
                value={inflation}
                onChange={(e) => setInflation(parseInt(e.target.value))}
              />
              <span className="slider-value">{inflation}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="post-retirement-inflation">Post Retirement Inflation (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="post-retirement-inflation"
                min="0"
                max="10"
                value={postRetirementInflation}
                onChange={(e) => setPostRetirementInflation(parseInt(e.target.value))}
              />
              <span className="slider-value">{postRetirementInflation}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="post-retirement-risk-free-rate">Post Retirement Risk Free Rate (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="post-retirement-risk-free-rate"
                min="0"
                max="10"
                value={postRetirementRiskFreeRate}
                onChange={(e) => setPostRetirementRiskFreeRate(parseInt(e.target.value))}
              />
              <span className="slider-value">{postRetirementRiskFreeRate}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="return-on-existing-investment">Return on Existing Investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-on-existing-investment"
                min="0"
                max="10"
                value={returnOnExistingInvestment}
                onChange={(e) => setReturnOnExistingInvestment(parseInt(e.target.value))}
              />
              <span className="slider-value">{returnOnExistingInvestment}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="return-on-new-investment">Return on New Investment (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-on-new-investment"
                min="0"
                max="10"
                value={returnOnNewInvestment}
                onChange={(e) => setReturnOnNewInvestment(parseInt(e.target.value))}
              />
              <span className="slider-value">{returnOnNewInvestment}</span>
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
              Retirement Investment Plan
            </div>

            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}

            <table className="results-table">
              <tbody>
                <tr>
                  <td>Current Monthly Expenses</td>
                  <td>Rs. {currentMonthlyExpenses}</td>
                </tr>
                <tr>
                  <td>Existing Investment</td>
                  <td>Rs. {existingInvestment}</td>
                </tr>
                <tr>
                  <td>Current Age</td>
                  <td>Rs. {currentAge}</td>
                </tr>
                <tr>
                  <td>Retirement Age</td>
                  <td>Rs. {retirementAge}</td>
                </tr>
                <tr>
                  <td>Life Expectancy (Years)</td>
                  <td>Rs. {lifeExpectancy}</td>
                </tr>
                <tr>
                  <td>Future Monthly Expenses</td>
                  <td>Rs. {calculationResults.futureMonthlyExpenses}</td>
                </tr>
                <tr>
                  <td>Total Retirement Expenses</td>
                  <td>Rs. {calculationResults.totalRetirementExpenses}</td>
                </tr>
                <tr>
                  <td>Future Investment Value</td>
                  <td>Rs. {calculationResults.futureInvestmentValue}</td>
                </tr>
                <tr>
                  <td>Additional Amount Needed</td>
                  <td>Rs. {calculationResults.additionalAmountNeeded}</td>
                </tr>
                <tr>
                  <td>Monthly Savings Required</td>
                  <td>Rs. {calculationResults.monthlySavingsRequired}</td>
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

export default RetirementCalc;
