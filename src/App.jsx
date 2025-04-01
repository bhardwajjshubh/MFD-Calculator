import React, { useState, useRef } from "react";
import Navbar from "./components/JSXFile/Navbar";
import CalculatorGrid from "./components/JSXFile/CalculatorGrid";
import ChildEducation from "./components/JSXFile/ChildEducation";
import SipCalculator from "./components/JSXFile/SipCalculator";
import Lumpsum from "./components/JSXFile/Lumpsum";
import SipTopUp from "./components/JSXFile/SipTopUp";
import CostOfDelay from "./components/JSXFile/CostOfDelay";
import WeddingPlanner from "./components/JSXFile/Wedding";
import EmiCalc from "./components/JSXFile/EmiCalc"; 
import SwpCalc from "./components/JSXFile/SwpCalc";
import BirthdaySipCalculator from "./components/JSXFile/BirthdaySipCalculator";
import CarCalc from "./components/JSXFile/CarCalc";
import VacationCalculator from "./components/JSXFile/VacationCalc";
import RetirementCalc from "./components/JSXFile/RetirementCalc";
import LimitedSipCalc from "./components/JSXFile/LimitedSipCalc";
import HomeLoanVsSipCalc from "./components/JSXFile/HomeLoanVsSipCalc";
import LifeInsuranceCalc from "./components/JSXFile/LifeInsurance";
import Sidebar from "./components/JSXFile/Sidebar";

const App = () => {
  const [showCalculators, setShowCalculators] = useState(true);
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const toggleCalculator = () => {
    setShowCalculators(!showCalculators);
    setSelectedCalculator(null);
    setShowSidebar(false);
  };

  const openCalculator = (calculator) => {
    setSelectedCalculator(calculator);
    setShowCalculators(false);
    setShowSidebar(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
      console.log("File uploaded, URL:", imageURL);
    }
  };

  return (
    <>
      <Navbar toggleCalculator={toggleCalculator} />
      <div className="container">
        {showSidebar && (
          <div className="sidebar-container">
            <Sidebar
              activeItem={selectedCalculator}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              openCalculator={openCalculator}
            />
          </div>
        )}
        <div className="content">
          {!selectedCalculator && (
            <CalculatorGrid
              isVisible={showCalculators}
              onCalculatorSelect={openCalculator}
            />
          )}
          {selectedCalculator === "childEducation" && (
            <ChildEducation selectedImage={selectedImage} />
          )}
          {selectedCalculator === "sipCalculator" && (
            <SipCalculator selectedImage={selectedImage} />
          )}
          {selectedCalculator === "lumpsum" && (
            <Lumpsum selectedImage={selectedImage} />
          )}
          {selectedCalculator === "sipTopup"  && <SipTopUp selectedImage={selectedImage} />}
          {selectedCalculator === "costOfDelay" && <CostOfDelay selectedImage={selectedImage} />}
          {selectedCalculator === "grandWedding" && <WeddingPlanner selectedImage={selectedImage} />}
          {selectedCalculator === "emiCalculator" && <EmiCalc selectedImage={selectedImage} />}
          {selectedCalculator === "swpCalculator" && <SwpCalc selectedImage={selectedImage} />}
          {selectedCalculator === "birthdaySIP" && <BirthdaySipCalculator selectedImage={selectedImage} />}
          {selectedCalculator === "dreamCar" && <CarCalc selectedImage={selectedImage} />}
          {selectedCalculator === "dreamVacation" && <VacationCalculator selectedImage={selectedImage} />}
          {selectedCalculator === "dreamRetirement" && <RetirementCalc selectedImage={selectedImage} />}
          {selectedCalculator === "limitedPeriodSIP" && <LimitedSipCalc selectedImage={selectedImage} />}
          {selectedCalculator === "homeLoanVsSIP" && <HomeLoanVsSipCalc selectedImage={selectedImage} />}
          {selectedCalculator === "lifeInsuranceNeed" && <LifeInsuranceCalc selectedImage={selectedImage} />}
        </div>
      </div>
    </>
  );
};

export default App;
