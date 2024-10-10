import { useState } from "react";
import KeywordSearch from "./KeywordSearch";
import AiSearch from "./AiSearch";
import GuideSearch from "./GuideSearch";
import NaviCard from "./NaviCard";
import GuideDocument from "./GuideDocument";
import GuideMagazine from "./GuideMagazine";
import GuideLawyer from "./GuideLawyer";
import "./SearchPageContainer.css"; // 스타일 파일 추가

function SearchPageContainer() {
  const [isAiMode, setIsAiMode] = useState(false);

  const handleToggle = () => {
    setIsAiMode(!isAiMode);
  };
  console.log("11111isAiMode 상태:", isAiMode);

  return (
    <div className="search-page-container">
      {isAiMode ? (
        <AiSearch isAiMode={isAiMode} onToggle={handleToggle} />
      ) : (
        <KeywordSearch isAiMode={isAiMode} onToggle={handleToggle} />
      )}

      <NaviCard />
      <GuideSearch />
      <GuideDocument />
      <GuideLawyer />
      <GuideMagazine />
    </div>
  );
}

export default SearchPageContainer;
