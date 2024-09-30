import React from "react";
import "./Save.css";

const Save = () => {
  return (
    <div className="save-wrapper">
      <label htmlFor="checkboxInput" className="bookmark">
        <input type="checkbox" id="checkboxInput" />
        <svg
          width="12"
          viewBox="0 0 50 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="svgIcon"
        >
          <path
            d="M46 62.0085L46 3.88139L3.99609 3.88139L3.99609 62.0085L24.5 45.5L46 62.0085Z"
            stroke="black"
            strokeWidth={7}
          />
        </svg>
      </label>
    </div>
  );
};

export default Save;
