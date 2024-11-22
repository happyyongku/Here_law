import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "../../../assets/search/close.png";
import SearchIcon from "../../../assets/search/searchicon.png";

import "./CaseHeader.css";

function Header({ query }) {
  const [inputValue, setInputValue] = useState(query);
  const navigate = useNavigate();

  // input이 변경될 때 호출되는 함수
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // state 업데이트
  };

  // Close 버튼 클릭 시 input 값을 비우는 함수
  const handleClearInput = () => {
    setInputValue(""); // input 값을 초기화
  };

  // Enter 키를 눌렀을 때 검색하기
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/case?query=${inputValue}&page=1`); // 검색 후 새로운 URL로 이동
    }
  };
  return (
    <div className="case-header">
      <div className="case-header-search">
        <img src={SearchIcon} alt="search icon" className="case-search-icon" />
        {/* input 값과 onChange 핸들러 */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Enter 키 이벤트
        />
        {/* Close 버튼을 눌렀을 때 input 값 초기화 */}
        <img
          src={CloseIcon}
          alt="close icon"
          className="case-close-icon"
          onClick={handleClearInput} // Close 버튼 클릭 시 input 값 초기화
          style={{ cursor: "pointer" }} // 클릭 가능하게 커서 설정
        />
      </div>
    </div>
  );
}

export default Header;
