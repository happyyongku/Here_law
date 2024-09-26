import { useState } from "react";
import "./MagazineHeader.css";

function MagazineHeader() {
  const categories = [
    "Main",
    "Hotfix",
    "인기",
    "My",
    "분야1",
    "분야2",
    "분야3",
  ];

  return (
    <header className="magazine-header-wrap">
      <nav className="magazine-header-nav">
        <ul className="magazine-header-nav-list">
          {categories.map((category, index) => (
            <li key={index} className="magazine-header-nav-item">
              {category}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default MagazineHeader;
