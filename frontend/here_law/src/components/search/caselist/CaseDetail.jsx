import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CaseDetail.css";
import Save from "./Save";
import Light from "../../../assets/search/light.gif";
import axiosInstance from "../../../utils/axiosInstance";

const CaseDetail = () => {
  const { caseInfoId } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // 상세 조회 axios 요청
  const CaseDetailRequest = async () => {
    const token = localStorage.getItem("token");
    // console.log("아이디", caseInfoId);
    try {
      const response = await axiosInstance.get(
        `/spring_api/cases/${caseInfoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("판례 상세 조회 성공", response.data);
      setCaseItem(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("판례 상세 조회 실패", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CaseDetailRequest();
  }, [caseInfoId]);

  // 더보기
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };
  // 로딩 중일 때 로딩 메시지 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // caseItem이 없을 경우 처리
  if (!caseItem) {
    return <div>No case details found</div>;
  }

  return (
    <div>
      <div className="case-detail-page">
        {/* 사건명 */}
        <div className="case-detail-title">{caseItem.caseName}</div>
        <div className="case-detail-bar">
          <div className="bar-sort">
            <div>{caseItem.caseType}</div>
            <div style={{ backgroundColor: "#F7E111" }}>
              {caseItem.courtName}
            </div>
            <div style={{ backgroundColor: "#FF9898" }}>
              {caseItem.judgment}
            </div>
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
          <img src={Light} alt="Light Icon" className="light-icon" />
          <div className="guide-box">요점보기</div>
          <div>
            AI가 추출한 핵심 문장으로 판결문 요점을 빠르게 파악해 보세요.
          </div>
        </div>
        <div className="detail-title">판결 요약</div>

        {/* 판결 요약을 클릭하면 아래 내용이 나오도록 해줘 */}

        <div className="case-detail-guide">
          <img src={Light} alt="Light Icon" className="light-icon" />
          <div className="guide-box">판결</div>
          <div>판결을 요약해서 보여드립니다.</div>
        </div>

        <div className="detail-text">{caseItem.judgmentSummary}</div>

        <div className="detail-title">판결 결과</div>
        <div className="detail-text" style={{ textAlign: "center" }}>
          “{caseItem.judgment}”
        </div>

        <div className="detail-title">주요 쟁점</div>
        <div className="detail-text">{caseItem.issues}</div>

        <div>
          <div className="detail-title">전문</div>
          <div
            className={`detail-text ${isExpanded ? "expanded" : "collapsed"}`}
          >
            <div style={{ fontWeight: "bold" }}>사건의 경위</div>
            {isExpanded
              ? caseItem.fullText // API에서 전문 부분이 있으면 불러오기
              : truncateText(caseItem.fullText, 100)}
          </div>

          <div style={{ marginTop: "10px" }}>
            <div className="detail-see-more" onClick={toggleText}>
              {isExpanded ? "접기" : "더보기"}
            </div>
          </div>
        </div>
        <div className="detail-title">조문</div>
        <div className="detail-text">
          <span style={{ fontWeight: "bold" }}>참조조문</span> :{" "}
          {caseItem.referenceClause}
        </div>
        <div className="detail-title">변호사 추천</div>
        {/* 변호사 추천 데이터 */}
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
