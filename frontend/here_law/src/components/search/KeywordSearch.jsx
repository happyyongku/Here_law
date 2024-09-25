import Switch from "./Switch";
import SearchIcon from "../../assets/search/searchicon.png";
import AiSearch from "./AiSearch"; // AiSearch 컴포넌트 import
import "./KeywordSearch.css";

function KeywordSearch({ isAiMode, onToggle }) {
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
          <input type="text" placeholder="키워드를 검색하세요" />
        </div>
      )}
    </div>
  );
}

export default KeywordSearch;
