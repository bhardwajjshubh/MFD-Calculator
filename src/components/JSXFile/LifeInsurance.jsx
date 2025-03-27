import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const LifeInsuranceCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [currentAge, setCurrentAge] = useState(1);
  const [spouseAge, setSpouseAge] = useState(1);
  const [spouseLifeExpectancy, setSpouseLifeExpectancy] = useState(18);
  const [totalChild, setTotalChild] = useState(1);
  const [child1Age, setChild1Age] = useState(1);
  const [child2Age, setChild2Age] = useState(1);
  const [higherEducationAge, setHigherEducationAge] = useState(1);
  const [marriageAge, setMarriageAge] = useState(1);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState("");
  const [inflation, setInflation] = useState(4);
  const [riskFreeRate, setRiskFreeRate] = useState(4);
  const [childFutureReturn, setChildFutureReturn] = useState(0);
  const [higherEducationCost, setHigherEducationCost] = useState("");
  const [marriageCost, setMarriageCost] = useState("");
  const [outstandingLoan, setOutstandingLoan] = useState("");
  const [currentLifeCover, setCurrentLifeCover] = useState("");
  const [currentInvestments, setCurrentInvestments] = useState("");
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculate = () => {
    const monthlyExpenses = parseFloat(currentMonthlyExpenses) || 0;
    const educationCost = parseFloat(higherEducationCost) || 0;
    const weddingCost = parseFloat(marriageCost) || 0;
    const loanAmount = parseFloat(outstandingLoan) || 0;
    const currentCover = parseFloat(currentLifeCover) || 0;
    const investments = parseFloat(currentInvestments) || 0;
    const childReturnRate = parseFloat(childFutureReturn) || 0;

    // Calculate future expenses
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflation / 100, spouseLifeExpectancy - currentAge);
    const futureEducationCost = educationCost * Math.pow(1 + childReturnRate / 100, higherEducationAge - child1Age);
    const futureWeddingCost = weddingCost * Math.pow(1 + childReturnRate / 100, marriageAge - child2Age);

    // Calculate total life insurance needed
    const totalInsuranceNeeded = (futureMonthlyExpenses * 12 * (spouseLifeExpectancy - currentAge)) +
                                  futureEducationCost + futureWeddingCost + loanAmount - currentCover - investments;

    setCalculationResults({
      futureMonthlyExpenses: futureMonthlyExpenses.toFixed(2),
      futureEducationCost: futureEducationCost.toFixed(2),
      futureWeddingCost: futureWeddingCost.toFixed(2),
      totalInsuranceNeeded: totalInsuranceNeeded.toFixed(2),
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
  
        pdf.save("Life_Insurance_calculation.pdf");
  
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
        <h2>Life Insurance Calculator</h2>
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
        </div>
        <div className="form-row">
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
          <div className="form-group">
            <label htmlFor="spouse-age">Spouse Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="spouse-age"
                min="1"
                max="100"
                value={spouseAge}
                onChange={(e) => setSpouseAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{spouseAge}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="spouse-life-expectancy">Spouse Life Expectancy (Years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="spouse-life-expectancy"
                min="18"
                max="100"
                value={spouseLifeExpectancy}
                onChange={(e) => setSpouseLifeExpectancy(parseInt(e.target.value))}
              />
              <span className="slider-value">{spouseLifeExpectancy}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="total-child">Total Children</label>
            <div className="slider-container">
              <input
                type="range"
                id="total-child"
                min="0"
                max="10"
                value={totalChild}
                onChange={(e) => setTotalChild(parseInt(e.target.value))}
              />
              <span className="slider-value">{totalChild}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="child1-age">Child 1 Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="child1-age"
                min="0"
                max="20"
                value={child1Age}
                onChange={(e) => setChild1Age(parseInt(e.target.value))}
              />
              <span className="slider-value">{child1Age}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="child2-age">Child 2 Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="child2-age"
                min="0"
                max="20"
                value={child2Age}
                onChange={(e) => setChild2Age(parseInt(e.target.value))}
              />
              <span className="slider-value">{child2Age}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="higher-education-age">Higher Education Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="higher-education-age"
                min="18"
                max="30"
                value={higherEducationAge}
                onChange={(e) => setHigherEducationAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{higherEducationAge}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="marriage-age">Marriage Age</label>
            <div className="slider-container">
              <input
                type="range"
                id="marriage-age"
                min="18"
                max="40"
                value={marriageAge}
                onChange={(e) => setMarriageAge(parseInt(e.target.value))}
              />
              <span className="slider-value">{marriageAge}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="current-monthly-expenses">Current Monthly Expenses</label>
            <input
              type="number"
              id="current-monthly-expenses"
              value={currentMonthlyExpenses}
              onChange={(e) => setCurrentMonthlyExpenses(e.target.value)}
            />
          </div>
          <div className="pair-group">
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
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="risk-free-rate">Risk Free Rate of Return (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="risk-free-rate"
                min="0"
                max="10"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(parseInt(e.target.value))}
              />
              <span className="slider-value">{riskFreeRate}</span>
            </div>
          </div>
          <div className="pair-group">
            <label htmlFor="child-future-return">Return on Invest of Child Future (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="child-future-return"
                min="0"
                max="10"
                value={childFutureReturn}
                onChange={(e) => setChildFutureReturn(parseInt(e.target.value))}
              />
              <span className="slider-value">{childFutureReturn}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="higher-education-cost">Current Cost of Higher Education</label>
            <input
              type="number"
              id="higher-education-cost"
              value={higherEducationCost}
              onChange={(e) => setHigherEducationCost(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="marriage-cost">Current Cost of Marriage</label>
            <input
              type="number"
              id="marriage-cost"
              value={marriageCost}
              onChange={(e) => setMarriageCost(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="outstanding-loan">Total Outstanding Loan Amount as of Today</label>
            <input
              type="number"
              id="outstanding-loan"
              value={outstandingLoan}
              onChange={(e) => setOutstandingLoan(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="current-life-cover">Current Life Insurance Cover</label>
            <input
              type="number"
              id="current-life-cover"
              value={currentLifeCover}
              onChange={(e) => setCurrentLifeCover(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="current-investments">Current Value of Investments</label>
            <input
              type="number"
              id="current-investments"
              value={currentInvestments}
              onChange={(e) => setCurrentInvestments(e.target.value)}
            />
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
              Life Insurance Calculation
            </div>

            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}

            <table className="results-table">
              <tbody>
                <tr>
                  <td>Future Monthly Expenses</td>
                  <td>Rs. {calculationResults.futureMonthlyExpenses}</td>
                </tr>
                <tr>
                  <td>Future Higher Education Cost</td>
                  <td>Rs. {calculationResults.futureEducationCost}</td>
                </tr>
                <tr>
                  <td>Future Wedding Cost</td>
                  <td>Rs. {calculationResults.futureWeddingCost}</td>
                </tr>
                <tr>
                  <td>Total Life Insurance Needed</td>
                  <td>Rs. {calculationResults.totalInsuranceNeeded}</td>
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

export default LifeInsuranceCalc;
