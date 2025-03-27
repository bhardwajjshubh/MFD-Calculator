import React, { useState} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Footer from "./Footer";

const SipTopUp = ({ selectedImage }) => {
  const [name, setName] = useState("");
  const [sipAmount, setSipAmount] = useState("");
  const [expectedReturn, setExpectedReturn] = useState(1);
  const [yearlyTopUp, setYearlyTopUp] = useState(1);
  const [noOfYears, setNoOfYears] = useState(1);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateSipTopUp = () => {
    if (!sipAmount || sipAmount <= 0) {
      alert("Please enter a valid SIP amount.");
      return;
    }

    const monthlySIP = parseFloat(sipAmount);
    const r = expectedReturn / 100 / 12; // Convert annual return to monthly
    const n = noOfYears * 12; // Total months
    const topUpRate = yearlyTopUp / 100; // Convert % top-up to decimal

    let amount = 0;
    let currentSIP = monthlySIP;
    let totalInvestment = 0;

    for (let i = 1; i <= n; i++) {
      amount = (amount + currentSIP) * (1 + r);
      totalInvestment += currentSIP;
      if (i % 12 === 0) {
        currentSIP *= 1 + topUpRate; // Increase SIP amount annually
      }
    }

    setCalculationResults({
      futureValue: amount.toFixed(2),
      totalInvestment: totalInvestment.toFixed(2),
      totalInterest: (amount - totalInvestment).toFixed(2),
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
  
        pdf.save("Sip_TopUp_calculation.pdf");
  
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
        <h2>SIP Top-Up Calculator</h2>
        
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
            <label htmlFor="sip-amount">Monthly SIP Amount</label>
            <input
              type="number"
              id="sip-amount"
              value={sipAmount}
              onChange={(e) => setSipAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
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
              <span className="slider-value">{expectedReturn}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="yearly-topup">Yearly Top-Up (%)</label>
            <div className="slider-container">
              <input
                type="range"
                id="yearly-topup"
                min="1"
                max="20"
                value={yearlyTopUp}
                onChange={(e) => setYearlyTopUp(parseInt(e.target.value))}
              />
              <span className="slider-value">{yearlyTopUp}</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="no-of-years">Number of Years</label>
            <div className="slider-container">
              <input
                type="range"
                id="no-of-years"
                min="1"
                max="30"
                value={noOfYears}
                onChange={(e) => setNoOfYears(parseInt(e.target.value))}
              />
              <span className="slider-value">{noOfYears}</span>
            </div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateSipTopUp}>
          Calculate
        </button>

        {calculationResults && (
          <div className="results-container">
            <div className="results-header">
              Dear {name}
              <br />
              SIP Top-Up Investment Plan
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
                  <td>Number of Years</td>
                  <td>{noOfYears} years</td>
                </tr>
                <tr>
                  <td>Expected Return Rate</td>
                  <td>{expectedReturn}%</td>
                </tr>
                <tr>
                  <td>Yearly Top-Up Rate</td>
                  <td>{yearlyTopUp}%</td>
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

export default SipTopUp;