import { useState } from "react";
import KeywordSearch from "./KeywordSearch";
import AiSearch from "./AiSearch";
import GuideSearch from "./GuideSearch";
import NaviCard from "./NaviCard";
import GuideDocument from "./GuideDocument";
import GuideMagazine from "./GuideMagazine";
import GuideLawyer from "./GuideLawyer";

function SearchPageContainer() {
  const [isAiMode, setIsAiMode] = useState(false);

  const handleToggle = (checked) => {
    setIsAiMode(checked);
  };

  return (
    <div>
      {/* isAiMode 상태에 따라 AiSearch 또는 KeywordSearch 렌더링 */}
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
