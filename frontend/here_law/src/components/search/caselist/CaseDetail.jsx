import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "./CaseDetail.css";
import Save from "./Save";
import Light from "../../../assets/search/light.gif";
import DetailpagePen from "../../../assets/search/detailpagepen.gif";
import TopIcon from "../../../assets/search/detailtop.png";
import Question from "../../../assets/search/question.png";

const CaseDetail = ({ caseInfoId: propsCaseInfoId }) => {
  const { caseInfoId: paramsCaseInfoId } = useParams();
  const caseInfoId = propsCaseInfoId || paramsCaseInfoId;
  const [caseItem, setCaseItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTip, setShowTip] = useState(false); // tip 표시 상태
  const [showTip2, setShowTip2] = useState(false);
  const [showTip3, setShowTip3] = useState(false);
  const [showQuestionIcon, setShowQuestionIcon] = useState(false); // Question 아이콘 표시 상태
  const [showQuestionIcon2, setShowQuestionIcon2] = useState(false); // Question 아이콘 표시 상태
  const [showQuestionIcon3, setShowQuestionIcon3] = useState(false); // Question 아이콘 표시 상태

  // 각 섹션에 대한 참조 생성
  const judgmentSummaryRef = useRef(null);
  const judgmentResultRef = useRef(null);
  const mainIssuesRef = useRef(null);
  const fullTextRef = useRef(null);
  const referenceClauseRef = useRef(null);
  const lawyerRecommendationRef = useRef(null);

  // 상세 조회 axios 요청
  const CaseDetailRequest = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/spring_api/cases/${caseInfoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // 텍스트를 제한된 길이로 자르는 함수
  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  // 클릭 시 해당 섹션으로 스크롤
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // tip 표시/숨기기 토글 함수
  const toggleTip = () => {
    setShowTip(!showTip);
  };

  const toggleTip2 = () => {
    setShowTip2(!showTip2);
  };

  const toggleTip3 = () => {
    setShowTip3(!showTip3);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!caseItem) {
    return <div>No case details found</div>;
  }

  // 전문 텍스트를 줄바꿈 처리하는 함수
  const formatFullText = (text) => {
    return text.replace(/(【[^】]+】)/g, "<br/>$1<br/>"); // 괄호 앞뒤에 줄바꿈 추가
  };

  return (
    <div>
      <div className="case-detail-page">
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
          <div onClick={() => scrollToSection(judgmentSummaryRef)}>
            판결 요약
          </div>
          <div onClick={() => scrollToSection(judgmentResultRef)}>
            판결 결과
          </div>
          <div onClick={() => scrollToSection(mainIssuesRef)}>주요 쟁점</div>
          <div onClick={() => scrollToSection(fullTextRef)}>전문</div>
          <div onClick={() => scrollToSection(referenceClauseRef)}>조문</div>
          <div onClick={() => scrollToSection(lawyerRecommendationRef)}>
            변호사 추천
          </div>
        </div>

        <div className="case-detail-guide">
          <img src={DetailpagePen} alt="Light Icon" className="light-icon" />
          <div className="guide-box">요점보기</div>
          <div>
            AI가 추출한 핵심 문장으로 판결문 요점을 빠르게 파악해 보세요.
          </div>
        </div>

        <div
          className="detail-title"
          ref={judgmentSummaryRef}
          onMouseEnter={() => setShowQuestionIcon(true)}
          onMouseLeave={() => setShowQuestionIcon(false)}
          onClick={toggleTip}
        >
          판결 요약
          {showQuestionIcon && (
            <img
              src={Question}
              alt="question-icon"
              className="detail-question-icon"
            />
          )}
        </div>

        {/* tip 판결 요약 */}
        {showTip && (
          <div className="case-detail-guide2">
            <img src={Light} alt="Light Icon" className="light-icon" />
            <div className="guide-box2">판결 요약</div>
            <div>판결을 요약해서 보여드립니다.</div>
          </div>
        )}

        <div className="detail-text">{caseItem.judgmentSummary}</div>

        <div
          className="detail-title"
          ref={judgmentResultRef}
          onMouseEnter={() => setShowQuestionIcon2(true)}
          onMouseLeave={() => setShowQuestionIcon2(false)}
          onClick={toggleTip2}
        >
          판결 결과
          {showQuestionIcon2 && (
            <img
              src={Question}
              alt="question-icon"
              className="detail-question-icon"
            />
          )}
        </div>
        {/* tip 판결 요약 */}
        {showTip2 && (
          <div className="case-detail-guide2">
            <img src={Light} alt="Light Icon" className="light-icon" />
            <div className="guide-box2">판결 결과</div>
            <div>판결의 결과입니다.</div>
          </div>
        )}
        <div className="detail-text" style={{ textAlign: "center" }}>
          “{caseItem.judgment}”
        </div>

        <div
          className="detail-title"
          ref={mainIssuesRef}
          onMouseEnter={() => setShowQuestionIcon3(true)}
          onMouseLeave={() => setShowQuestionIcon3(false)}
          onClick={toggleTip3}
        >
          주요 쟁점
          {showQuestionIcon3 && (
            <img
              src={Question}
              alt="question-icon"
              className="detail-question-icon"
            />
          )}
        </div>

        {/* tip 판결 요약 */}
        {showTip3 && (
          <div className="case-detail-guide2">
            <img src={Light} alt="Light Icon" className="light-icon" />
            <div className="guide-box2">주요 쟁점</div>
            <div>법적 문제나 사건에서 핵심적으로 다뤄야 할 중요한 논점</div>
          </div>
        )}

        <div className="detail-text" style={{ textAlign: "center" }}>
          {caseItem.issues}
        </div>

        <div ref={fullTextRef}>
          <div className="detail-title2">전문</div>
          <div
            className={`detail-text ${isExpanded ? "expanded" : "collapsed"}`}
          >
            <div style={{ fontWeight: "bold" }}>사건의 경위</div>
            <div
              dangerouslySetInnerHTML={{
                __html: isExpanded
                  ? formatFullText(caseItem.fullText) // 줄바꿈된 텍스트를 표시
                  : formatFullText(truncateText(caseItem.fullText, 100)),
              }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <div className="detail-see-more" onClick={toggleText}>
              {isExpanded ? "접기" : "더보기"}
            </div>
          </div>
        </div>

        <div className="detail-title2" ref={referenceClauseRef}>
          조문
        </div>
        <div className="detail-text2">
          <span style={{ fontWeight: "bold" }}>참조조문</span> :{" "}
          {caseItem.referenceClause}
        </div>

        {/* <div className="detail-title" ref={lawyerRecommendationRef}>
          변호사 추천
        </div> */}
        {/* <div className="detail-lawyer-list">
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
        </div> */}
      </div>

      {/* Top Icon */}
      <img
        src={TopIcon}
        alt="Top Icon"
        className="top-icon"
        onClick={scrollToTop}
      />
    </div>
  );
};

export default CaseDetail;
