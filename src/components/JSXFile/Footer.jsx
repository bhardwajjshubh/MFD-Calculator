import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <img 
        src="src\assets\logo.png" 
        alt="AutoWealth.in Logo" 
        style={{ maxWidth: '150px', marginBottom: '10px' }} 
      />
      <div>
        <strong>Rajesh Singh</strong>
      </div>
      <div>
        AMFI Registered Mutual Fund Distributor
      </div>
      <div>
        <a href="mailto:support@autowealth.in">support@autowealth.in</a>
      </div>
      <div>
        9341059619
      </div>
      <div>
        120/B, 1st floor, Malleshpalya, Bangalore 560075
      </div>
      <div>
        <a href="https://www.autowealth.in" target="_blank" rel="noopener noreferrer">
          https://www.autowealth.in
        </a>
      </div>
      <div style={{ marginTop: '20px' }}>
        <strong>Disclaimer</strong>
      </div>
      <div>
        The above calculation is only for illustrative purposes.
      </div>
      <div>
        Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
      </div>
    </footer>
  );
};

export default Footer;