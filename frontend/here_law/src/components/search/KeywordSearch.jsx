import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Switch from "./Switch";
import SearchIcon from "../../assets/search/searchicon.png";
import AiSearch from "./AiSearch";

import "./KeywordSearch.css";

function KeywordSearch({ isAiMode, onToggle }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      // query 검색어가 있으면 검색 결과 페이지로 이동함
      navigate(`/search/case?query=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <div className="keyword-search-page">
      <div className="search-title">
        키워드 또는 Ai 검색으로 <br /> 판례를 검색하세요
        <span style={{ color: "#ff5e00" }}>.</span>
      </div>

      <div className="toggle-wrap">
        <Switch onToggle={onToggle} isChecked={isAiMode} />
      </div>

      {/* isAiMode 상태에 따라 다른 컴포넌트를 렌더링 */}
      {isAiMode ? (
        <AiSearch />
      ) : (
        <div className="search-input-box">
          <img src={SearchIcon} alt="search icon" className="search-icon" />
          <input
            type="text"
            placeholder="키워드를 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(); // Enter 키를 누르면 검색 실행
            }}
          />
        </div>
      )}
    </div>
  );
}

export default KeywordSearch;
