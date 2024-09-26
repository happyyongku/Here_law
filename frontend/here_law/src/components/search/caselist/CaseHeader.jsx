import CloseIcon from "../../../assets/search/close.png";
import SearchIcon from "../../../assets/search/searchicon.png";

import "./CaseHeader.css";

function Header({ query }) {
  return (
    <div className="case-header">
      <div>로고</div>

      <div className="case-header-search">
        <img src={SearchIcon} alt="search icon" className="case-search-icon" />
        <input type="text" placeholder={query} />
        <img src={CloseIcon} alt="close icon" className="case-close-icon" />
      </div>
    </div>
  );
}

export default Header;
