import React from "react";
import styles from "../CSSFile/CalculatorGrid.module.css";

const calculators = [
  { title: "SIP Calculator", icon: "📊", key: "sipCalculator" },
  { title: "Lumpsum", icon: "💰", key: "lumpsum" },
  { title: "Dream Retirement", icon: "🏖️", key: "dreamRetirement" },
  { title: "Grand Wedding", icon: "💒", key: "grandWedding" },
  { title: "Dream Vacation", icon: "🌴", key: "dreamVacation" },
  { title: "Child Education", icon: "🎓", key: "childEducation" },
  { title: "SIP Topup", icon: "📈", key: "sipTopup" },
  { title: "Limited Period SIP", icon: "⏳", key: "limitedPeriodSIP" },
  { title: "Life Insurance Need", icon: "🛡️", key: "lifeInsuranceNeed" },
  { title: "Home Loan vs SIP Calculator", icon: "🏠", key: "homeLoanVsSIP" },
  { title: "EMI Calculator", icon: "📑", key: "emiCalculator" },
  { title: "Dream Car", icon: "🚗", key: "dreamCar" },
  { title: "Cost of Delay", icon: "⏰", key: "costOfDelay" },
  { title: "Birthday SIP", icon: "🎂", key: "birthdaySIP" },
  { title: "SWP Calculator", icon: "💵", key: "swpCalculator" },
];

const CalculatorGrid = ({ isVisible, onCalculatorSelect }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Calculators</h2>
      <div className={styles.grid}>
        {calculators.map((calc, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => calc.key && onCalculatorSelect(calc.key)} // Calls function on click
          >
            <span className={styles.icon}>{calc.icon}</span>
            <p className={styles.title}>{calc.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorGrid;
