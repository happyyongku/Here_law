import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import "./CaseDetail.css";
import Save from "./Save";

const CaseDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const caseData = useSelector((state) => state.cases); // 리덕스 스토어에서 데이터 가져오기
  const caseItem = caseData.cases.find((c) => c.id === Number(id)); // 해당 id에 맞는 caseItem 찾기

  // if (!caseItem) {
  //   return <div>판례 없음 </div>;
  // }

  return (
    <div>
      <div className="case-detail-page">
        {/* 사건명 */}
        <div className="case-detail-title">{caseItem.title}</div>
        <div className="case-detail-bar">
          <div className="bar-sort">
            <div>A</div>
            <div style={{ backgroundColor: "#F7E111" }}>B</div>
            <div style={{ backgroundColor: "#FF9898" }}>C</div>
          </div>

          <div className="bar-save">
            <Save />
          </div>
        </div>
        <div className="case-detail-tab">
          <div style={{ color: "black", fontWeight: "bold" }}>요약</div>
          <div>전문</div>
          <div>주문</div>
          <div>조문</div>
        </div>
        <div className="case-detail-guide">
          <div className="guide-box">요점보기</div>
          <div>
            AI가 추출한 핵심 문장으로 판결문 요점을 빠르게 파악해 보세요.
          </div>
        </div>

        <p>{caseItem.summary}</p>
        <p>판결일: {caseItem.date}</p>
        <p>결과: {caseItem.result}</p>
        <p>관련 법령: {caseItem.relatedLaws.join(", ")}</p>
      </div>
    </div>
  );
};

export default CaseDetail;
