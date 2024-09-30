import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import "./CaseDetail.css";
import Save from "./Save";

const CaseDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const caseData = useSelector((state) => state.cases); // 리덕스 스토어에서 데이터 가져오기
  const caseItem = caseData.cases.find((c) => c.id === Number(id)); // 해당 id에 맞는 caseItem 찾기

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  // 기존에 작성한 전체 텍스트를 변수에 담기
  const caseDetails = {
    경위: "원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매  계약을 체결하였습니다. 계약서에는 매매 대금 5,000만 원을 계약 체결 후 30일 이내에 지급하고, 계약이행 보증금 50반에 해당하는지, 그리고 그로 인해 원고가 입은 손해의 배상 범위입니다.",
    쟁점: "이 사건의 주요 쟁점은 피고가 계약에서 정한 매매 대금을 지급하지 않았다는 사실이 계약원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매 원고 A씨는 피고 B씨와 부동산 매매  위반에 해당하는지, 그리고 그로 인해 원고가 입은 손해의 배상 범위입니다.",
  };

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
        <div className="detail-title">요약</div>
        <div className="detail-text">{caseItem.summary}</div>
        <div className="detail-title">주문</div>
        <div className="detail-text" style={{ textAlign: "center" }}>
          “피고는 원고에게 1000만원을 지급하라”
        </div>
        <div>
          <div className="detail-title">전문</div>
          <div
            className={`detail-text ${isExpanded ? "expanded" : "collapsed"}`}
          >
            <div style={{ fontWeight: "bold" }}>사건의 경위</div>
            {isExpanded
              ? caseDetails.경위
              : truncateText(caseDetails.경위, 100)}
          </div>

          <div
            className={`detail-text ${isExpanded ? "expanded" : "collapsed"}`}
          >
            <div style={{ fontWeight: "bold" }}>쟁점</div>
            {isExpanded
              ? caseDetails.쟁점
              : truncateText(caseDetails.쟁점, 100)}
          </div>

          <div style={{ marginTop: "10px" }}>
            <div className="detail-see-more" onClick={toggleText}>
              {isExpanded ? "접기" : "더보기"}
            </div>
          </div>
        </div>
        <div className="detail-title">조문</div>
        <div className="detail-text">
          <span style={{ fontWeight: "bold" }}>민법 제390조</span> : 계약의
          이행이 불가능한 경우에는 상대방에게 손해를 배상할 책임이 있다.
        </div>
        <div className="detail-text">
          <span style={{ fontWeight: "bold" }}>상법 제397조</span> : 계약의
          당사자는 계약을 이행할 의무가 있으며, 이행하지 아니한 경우
          손해배상책임을 진다.
        </div>
        <div className="detail-title">변호사 추천</div>
        <div className="detail-lawyer-list">
          <div className="lawyer-text">
            <div className="lawyer-name">강경민 변호사</div>
            <div className="lawyer-detail">
              실전에 강한 변호사. 이혼 전문입니다.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="lawyer-sort">분야</div>
              <div
                className="lawyer-sort"
                style={{ backgroundColor: "#85B6FF" }}
              >
                분야
              </div>
            </div>
          </div>
          <div className="lawyer-image"></div>
        </div>
        <div className="detail-lawyer-list">
          <div className="lawyer-text">
            <div className="lawyer-name">강경민 변호사</div>
            <div className="lawyer-detail">
              실전에 강한 변호사. 이혼 전문입니다.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="lawyer-sort">분야</div>
              <div
                className="lawyer-sort"
                style={{ backgroundColor: "#85B6FF" }}
              >
                분야
              </div>
            </div>
          </div>
          <div className="lawyer-image"></div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
