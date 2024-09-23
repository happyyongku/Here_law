import { useState } from "react";
import Switch from "./Switch";
import SearchIcon from "../../assets/search/searchicon.png";
import "./KeywordSearch.css";

function KeywordSearch() {
  const [isAiMode, setIsAiMode] = useState(false);

  const handleSwitchToggle = (checked) => {
    setIsAiMode(checked);
  };

  return (
    <div className="keyword-search-page">
      <div className="search-title">
        키워드 또는 Ai 검색으로 <br /> 판례를 검색하세요
        <span style={{ color: "#ff5e00" }}>.</span>
      </div>

      <div className="toggle-wrap">
        <Switch onToggle={handleSwitchToggle} />
      </div>

      <div className="search-input-box">
        <img src={SearchIcon} alt="search icon" className="search-icon" />
        <input type="text" placeholder="키워드를 검색하세요" />
      </div>
    </div>
  );
}

export default KeywordSearch;
