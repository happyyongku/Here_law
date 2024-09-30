import React from "react";
import { useNavigate } from "react-router-dom";
import "./CaseItem.css";

const CaseItem = ({
  id,
  title,
  summary,
  date,
  result,
  relatedLaws,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleCaseClick = () => {
    navigate(`/search/case/${id}`); // ID를 URL로 전달
  };

  return (
    <div className="case-item" onClick={handleCaseClick}>
      <div className="case-item-title">{title}</div>
      <p className="case-item-summary">{summary}</p>

      <div className="case-item-info">
        <div>판결일: {date}</div>
        <div>결과: {result}</div>
        <div>관련 법령: {relatedLaws.join(", ")}</div>
      </div>
      <hr />
    </div>
  );
};

export default CaseItem;
