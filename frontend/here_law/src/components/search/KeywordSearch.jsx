import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Switch from "./Switch";
import SearchIcon from "../../assets/search/searchicon.png";
import AiSearch from "./AiSearch";

import "./KeywordSearch.css";

function KeywordSearch() {
  const [query, setQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [showAiSearch, setShowAiSearch] = useState(false); // AI 검색 표시 상태
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/case?query=${encodeURIComponent(query)}&page=1`);
    }
  };

  const handleToggle = (checked) => {
    setIsAiMode(checked);
    setShowAiSearch(false); // 처음에 AI 검색을 숨김
    setTimeout(() => {
      setShowAiSearch(true); // 0.5초 후에 AI 검색 표시
    }, 500);
  };

  return (
    <div className={`keyword-search-page ${isAiMode ? "ai-mode" : ""}`}>
      <div className="search-title">
        키워드 또는 Ai 검색으로 <br /> 판례를 검색하세요
        <span style={{ color: "#ff5e00" }}>.</span>
      </div>

      <div className="toggle-wrap">
        <Switch
          onToggle={handleToggle}
          isChecked={isAiMode}
          onclickButton={() => setIsAiMode(!isAiMode)}
        />
      </div>

      {isAiMode && (
        <div className={`ai-search ${showAiSearch ? "active" : ""}`}>
          <AiSearch isAiMode={isAiMode} />
        </div>
      )}

      {!isAiMode && (
        <div className="search-input-box">
          <img src={SearchIcon} alt="search icon" className="search-icon" />
          <input
            type="text"
            placeholder="키워드를 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default KeywordSearch;
