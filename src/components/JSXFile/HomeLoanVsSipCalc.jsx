import React, { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from "./Footer";

const HomeLoanVsSipCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState(1);
  const [loanInterest, setLoanInterest] = useState(1);
  const [sipAmount, setSipAmount] = useState("");
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculate = () => {
    const principal = parseFloat(loanAmount) || 0;
    const annualInterestRate = parseFloat(loanInterest) || 0;
    const months = parseInt(tenure, 10) * 12;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const sipMonthlyAmount = parseFloat(sipAmount) || 0;
    const expectedReturnRate = parseFloat(expectedReturn) || 0;

    // Calculate EMI for the loan
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                (Math.pow(1 + monthlyInterestRate, months) - 1);

    // Calculate future value of the SIP
    const sipMonthlyReturnRate = expectedReturnRate / 100 / 12;
    let futureSipValue = 0;
    for (let month = 0; month < months; month++) {
      futureSipValue += sipMonthlyAmount * Math.pow(1 + sipMonthlyReturnRate, months - month);
    }

    setCalculationResults({
      emi: emi.toFixed(2),
      totalLoanRepayment: (emi * months).toFixed(2),
      futureSipValue: futureSipValue.toFixed(2),
      totalSipInvestment: (sipMonthlyAmount * months).toFixed(2),
      totalSipInterest: (futureSipValue - sipMonthlyAmount * months).toFixed(2),
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
  
        pdf.save("HomeLoanVsSIp_calculation.pdf");
  
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
        <h2>Home Loan vs SIP Calculator</h2>
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
            <label htmlFor="loan-amount">Loan Amount</label>
            <input
              type="number"
              id="loan-amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tenure">Tenure (Years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="tenure"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
              />
              <span className="slider-value">{tenure}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="loan-interest">Loan Interest (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="loan-interest"
                min="1"
                max="20"
                value={loanInterest}
                onChange={(e) => setLoanInterest(parseInt(e.target.value))}
              />
              <span className="slider-value">{loanInterest}</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sip-amount">SIP Amount</label>
            <input
              type="number"
              id="sip-amount"
              value={sipAmount}
              onChange={(e) => setSipAmount(e.target.value)}
            />
          </div>
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
              Home Loan vs SIP Comparison
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
                  <td>Loan Interest Rate</td>
                  <td>{loanInterest}%</td>
                </tr>
                <tr>
                  <td>EMI</td>
                  <td>Rs. {calculationResults.emi}</td>
                </tr>
                <tr>
                  <td>Total Loan Repayment</td>
                  <td>Rs. {calculationResults.totalLoanRepayment}</td>
                </tr>
                <tr>
                  <td>SIP Amount</td>
                  <td>Rs. {sipAmount}</td>
                </tr>
                <tr>
                  <td>Expected Return Rate</td>
                  <td>{expectedReturn}%</td>
                </tr>
                <tr>
                  <td>Future Value of SIP</td>
                  <td>Rs. {calculationResults.futureSipValue}</td>
                </tr>
                <tr>
                  <td>Total SIP Investment</td>
                  <td>Rs. {calculationResults.totalSipInvestment}</td>
                </tr>
                <tr>
                  <td>Total SIP Interest Earned</td>
                  <td>Rs. {calculationResults.totalSipInterest}</td>
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

export default HomeLoanVsSipCalc;
