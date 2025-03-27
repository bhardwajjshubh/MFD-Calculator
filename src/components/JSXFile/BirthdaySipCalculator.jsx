import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Footer from "./Footer";
import "../CSSFile/Common.css";


const BirthdaySipCalculator = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sipAmount, setSipAmount] = useState("");
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateSip = () => {
    if (!sipAmount || !birthDate) {
      alert("Please fill all required fields.");
      return;
    }

    const monthlyReturnRate = expectedReturn / 100 / 12;
    const totalMonths = 18 * 12; // Assuming 18 years of SIP investment
    const futureValue =
      sipAmount *
      ((Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate);

    setCalculationResults({
      futureValue: futureValue.toFixed(2),
      totalInvestment: (sipAmount * totalMonths).toFixed(2),
      totalInterest: (futureValue - sipAmount * totalMonths).toFixed(2),
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
  
        pdf.save("Birthday_Sip_calculation.pdf");
  
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
        <h2>Birthday SIP Calculator</h2>

        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="sip-amount">SIP Amount (Monthly)</label>
            <input
              type="number"
              id="sip-amount"
              placeholder="Your SIP amount"
              value={sipAmount}
              onChange={(e) => setSipAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birth-date">Birth Date</label>
            <input
              type="date"
              id="birth-date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
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
              <span className="slider-value">{expectedReturn}%</span>
            </div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateSip}>
          Calculate
        </button>

        {calculationResults && (
          <div className="results-container">
            <div className="results-header">
              Dear {name}, <br />
              Birthday SIP Investment Plan
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
                  <td>Rs. {sipAmount}</td>
                </tr>
                <tr>
                  <td>Birth Date</td>
                  <td>{birthDate}</td>
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

export default BirthdaySipCalculator;
