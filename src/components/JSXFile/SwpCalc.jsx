import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "./Footer";

const SwpCalc = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [lumpsum, setLumpsum] = useState("");
  const [swp, setSwp] = useState("");
  const [returnRate, setReturnRate] = useState(1);
  const [tenure, setTenure] = useState(1);
  const [deferredPeriod, setDeferredPeriod] = useState(0);
  const [calculationResults, setCalculationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateSWP = () => {
    const principal = parseFloat(lumpsum);
    const swpAmount = parseFloat(swp);
    const rate = returnRate / 100 / 12;
    const deferredMonths = deferredPeriod * 12;
    const totalMonths = tenure * 12;

    // Calculate balance after deferred period (compound interest)
    let balance = principal * Math.pow(1 + rate, deferredMonths);
    let totalWithdrawn = 0;

    // SWP Phase: Withdraw amount monthly while balance earns interest
    for (let i = 0; i < totalMonths - deferredMonths; i++) {
      balance = balance * (1 + rate) - swpAmount;
      if (balance <= 0) {
        balance = 0;
        break;
      }
      totalWithdrawn += swpAmount;
    }

    setCalculationResults({
      finalBalance: balance.toFixed(2),
      totalWithdrawn: totalWithdrawn.toFixed(2),
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
  
        pdf.save("Swp_calculation.pdf");
  
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
        <h2>SWP Calculator</h2>
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
            <label htmlFor="lumpsum">Lumpsum Investment</label>
            <input
              type="number"
              id="lumpsum"
              value={lumpsum}
              onChange={(e) => setLumpsum(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="pair-group">
            <label htmlFor="swp">SWP Amount</label>
            <input
              type="number"
              id="swp"
              value={swp}
              onChange={(e) => setSwp(e.target.value)}
            />
          </div>
          <div className="pair-group">
            <label htmlFor="return-rate">Assumed Return (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="return-rate"
                min="1"
                max="20"
                value={returnRate}
                onChange={(e) => setReturnRate(parseInt(e.target.value))}
              />
              <span className="slider-value">{returnRate}%</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tenure">Tenure (years)</label>
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
            <label htmlFor="deferred-period">Deferred Period (years)</label>
            <div className="slider-container">
              <input
                type="range"
                id="deferred-period"
                min="0"
                max="10"
                value={deferredPeriod}
                onChange={(e) => setDeferredPeriod(parseInt(e.target.value))}
              />
              <span className="slider-value">{deferredPeriod}</span>
            </div>
          </div>
        </div>
        <button className="calculate-btn" onClick={calculateSWP}>
          Calculate
        </button>
        {showResults && calculationResults && (
          <div className="results-container">
            <div className="results-header">
              Dear {name}
              <br />
              SWP Calculation Results
            </div>
  
            {selectedImage && (
              <div className="image-container">
                <img src={selectedImage} alt="Selected" />
              </div>
            )}
  
            <table className="results-table">
              <tbody>
                <tr>
                  <td>Lumpsum Investment</td>
                  <td>Rs. {lumpsum}</td>
                </tr>
                <tr>
                  <td>SWP Amount</td>
                  <td>Rs. {swp}</td>
                </tr>
                <tr>
                  <td>Return Rate</td>
                  <td>{returnRate}%</td>
                </tr>
                <tr>
                  <td>Tenure</td>
                  <td>{tenure} years</td>
                </tr>
                <tr>
                  <td>Deferred Period</td>
                  <td>{deferredPeriod} years</td>
                </tr>
                <tr>
                  <td>Total Withdrawn</td>
                  <td>Rs. {calculationResults.totalWithdrawn}</td>
                </tr>
                <tr>
                  <td>Final Balance</td>
                  <td>Rs. {calculationResults.finalBalance}</td>
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

export default SwpCalc;
