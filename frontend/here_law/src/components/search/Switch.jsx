import React, { useState } from "react";
import "./Switch.css";

const Switch = ({ onToggle, onclickButton }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    onToggle(e.target.checked);
  };

  return (
    <div className="btn-container">
      <label className="switch btn-color-mode-switch" onClick={onclickButton}>
        <input
          value="1"
          id="color_mode"
          name="color_mode"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        <label
          className="btn-color-mode-switch-inner"
          data-off="키워드"
          data-on="Ai"
          htmlFor="color_mode"
        />
      </label>
    </div>
  );
};

export default Switch;
