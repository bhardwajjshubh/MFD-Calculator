import React from "react";
import styles from "../CSSFile/Navbar.module.css";


const Navbar = ({ toggleCalculator }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem} onClick={toggleCalculator}>
          <a href="#" className={styles.navLink}>Calculator</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
