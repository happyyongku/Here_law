import { useState } from "react";
import KeywordSearch from "./KeywordSearch";
import NaviCard from "./NaviCard";

// import "./SearchPageContainer.css";

function SearchPageContainer() {
  return (
    <div>
      <KeywordSearch />
      <NaviCard />
    </div>
  );
}

export default SearchPageContainer;
