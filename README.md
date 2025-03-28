# Mutual Fund Calculator

## Overview
This is a React-based web application that provides a suite of financial calculators, including SIP Calculator, Lumpsum Calculator, Child Education Planner, EMI Calculator, Retirement Calculator, and more. The application features an interactive UI with a sidebar, calculator selection grid, and file upload functionality to enhance the user experience.

## Features
- **Multiple Calculators**: Includes a variety of financial calculators like SIP, Lumpsum, EMI, Retirement, and more.
- **Dynamic Sidebar**: Opens upon calculator selection and provides additional features like image upload.
- **File Upload Support**: Allows users to upload an image that can be used within the selected calculator.
- **Interactive UI**: A well-structured and dynamic interface for easy navigation.
- **Modular Components**: Uses reusable components for efficiency and maintainability.
- **Image Rendering**: Image is rendering through sidebar to Result part.
- **Download PDF**: User can download the Result part as pdf in their system.
  
## Technologies Used
- React.js
- JavaScript (ES6+)
- JSX
- CSS (for styling)
- Vite (for fast bundling and development)

## Folder Structure
```
mutual-fund-calculator/
│── src/
│   ├── components/
│   │   ├── JSXFile/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CalculatorGrid.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChildEducation.jsx
│   │   │   ├── SipCalculator.jsx
│   │   │   ├── Lumpsum.jsx
│   │   │   ├── SipTopUp.jsx
│   │   │   ├── CostOfDelay.jsx
│   │   │   ├── Wedding.jsx
│   │   │   ├── EmiCalc.jsx
│   │   │   ├── SwpCalc.jsx
│   │   │   ├── BirthdaySipCalculator.jsx
│   │   │   ├── CarCalc.jsx
│   │   │   ├── VacationCalc.jsx
│   │   │   ├── RetirementCalc.jsx
│   │   │   ├── LimitedSipCalc.jsx
│   │   │   ├── HomeLoanVsSipCalc.jsx
│   │   │   ├── LifeInsurance.jsx
│   ├── App.jsx
│   ├── main.jsx
│── public/
│── package.json
│── vite.config.js
│── README.md
```

## Installation

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/bhardwajjshubh/MFD-Calculator.git
   ```
2. Navigate to the project directory:
   ```sh
   cd MFD-Calculator
   ```
3. Install dependencies:
   ```sh
   npm install  
   ```
4. Start the development server:
   ```sh
   npm run dev  
   ```
5. Open the application in your browser:
   ```
http://localhost:5173/
   ```

## Usage
1. Click on the **Navbar Toggle** to open the calculator selection grid.
2. Select a calculator to open it in the main content area.
3. Use the sidebar to upload an image (optional).
4. Interact with the calculator inputs to compute results.
5. Navigate between different calculators as needed.
6. Rendering image from sidebar to Result part.

## Deployment
To deploy the project to GitHub Pages, follow these steps:
1. Build the project:
   ```sh
   npm run build  # or yarn build
   ```
2. Deploy using Vercel or Netlify:
   - Use the respective CLI tools (`vercel` or `netlify deploy`).

## Contribution
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes and commit:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any issues or suggestions, feel free to reach out or open an issue in the repository.

