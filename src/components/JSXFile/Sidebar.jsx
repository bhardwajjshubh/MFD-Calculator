import React, { useRef } from "react";
import styles from "../CSSFile/Sidebar.module.css";


const Sidebar = ({ activeItem, openCalculator, selectedImage, setSelectedImage }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // Update the parent component's state
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.sidebar}> {/* Use styles.sidebar */}
      <div className={styles["image-upload"]}> {/* Use styles["image-upload"] */}
        {selectedImage ? ( // Check if an image is selected
          <img
            src={selectedImage}
            alt="Uploaded"
            style={{
              cursor: "pointer",
              maxWidth: "100%",
              maxHeight: "100%",
              border: "1px solid black",
            }}
            onClick={handleImageClick}
          />
        ) : (
          <div
            onClick={handleImageClick}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <p style={{ fontSize: "2rem" }}>📤</p>
            <p>Click here to upload image</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      {/* ... rest of your buttons ... */}
      <button className={`${styles["sidebar-item"]} ${activeItem === "sipCalculator" ? styles.active : ""}`} onClick={() => openCalculator("sipCalculator")}>
        📊 SIP Calculator
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "lumpsum" ? styles.active : ""}`} onClick={() => openCalculator("lumpsum")}>
        💰 Lumpsum
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "dreamRetirement" ? styles.active : ""}`} onClick={() => openCalculator("dreamRetirement")}>
        🏖️ Dream Retirement
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "grandWedding" ? styles.active : ""}`} onClick={() => openCalculator("grandWedding")}>
        💒 Grand Wedding
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "dreamVacation" ? styles.active : ""}`} onClick={() => openCalculator("dreamVacation")}>
        🌴 Dream Vacation
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "childEducation" ? styles.active : ""}`} onClick={() => openCalculator("childEducation")}>
        🎓 Child Education
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "sipTopup" ? styles.active : ""}`} onClick={() => openCalculator("sipTopup")}>
        📈 SIP Topup
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "limitedPeriodSIP" ? styles.active : ""}`} onClick={() => openCalculator("limitedPeriodSIP")}>
        ⏳ Limited Period SIP
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "lifeInsuranceNeed" ? styles.active : ""}`} onClick={() => openCalculator("lifeInsuranceNeed")}>
        🛡️ Life Insurance Need
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "homeLoanVsSIP" ? styles.active : ""}`} onClick={() => openCalculator("homeLoanVsSIP")}>
        🏠 Home Loan vs SIP Calculator
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "emiCalculator" ? styles.active : ""}`} onClick={() => openCalculator("emiCalculator")}>
        📑 EMI Calculator
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "dreamCar" ? styles.active : ""}`} onClick={() => openCalculator("dreamCar")}>
        🚗 Dream Car
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "costOfDelay" ? styles.active : ""}`} onClick={() => openCalculator("costOfDelay")}>
        ⏰ Cost of Delay
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "birthdaySIP" ? styles.active : ""}`} onClick={() => openCalculator("birthdaySIP")}>
        🎂 Birthday SIP
      </button>
      <button className={`${styles["sidebar-item"]} ${activeItem === "swpCalculator" ? styles.active : ""}`} onClick={() => openCalculator("swpCalculator")}>
        💵 SWP Calculator
      </button>
    </div>
  );
};

export default Sidebar;