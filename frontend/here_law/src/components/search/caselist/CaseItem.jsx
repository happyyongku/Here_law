import React from "react";
import { useNavigate } from "react-router-dom";
import "./CaseItem.css";

const CaseItem = ({ caseItem }) => {
  const navigate = useNavigate();

  const handleCaseClick = () => {
    navigate(`/search/case/${caseItem.caseInfoId}`); // ID를 URL로 전달
  };

  return (
    <div className="case-item" onClick={handleCaseClick}>
      <div className="case-item-title">{caseItem.caseName}</div>
      <p className="case-item-summary">{caseItem.judgmentSummary}</p>

      <div className="case-item-info">
        <div>판결 : {caseItem.judgmentType}</div>
        <div>참조 조문 : {caseItem.referenceClause}</div>
        {/* <div>관련 법령: {relatedLaws.join(", ")}</div> */}
      </div>
      <hr />
    </div>
  );
};

export default CaseItem;
