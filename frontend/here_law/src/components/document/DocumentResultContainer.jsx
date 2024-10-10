import React, { useState, useEffect, useRef } from "react";
import RentHeader from "./RentHeader";
import { useLocation } from "react-router-dom";
import "./DocumentResultContainer.css";

function DocumentResultContainer() {
  const location = useLocation();
  const { analysis } = location.state || {}; // 전달된 state의 analysis 추출
  console.log(analysis);

  // 제목, 유리한 조항, 불리한 조항, 결론을 분리
  const [sectionTitle, setSectionTitle] = useState("");
  const [favorableClause, setFavorableClause] = useState("");
  const [unfavorableClause, setUnfavorableClause] = useState("");
  const [conclusion, setConclusion] = useState("");

  useEffect(() => {
    if (analysis) {
      // 제목 매칭
      const titleMatch = analysis.match(/(?<=\*\*)(제[0-9]+조.*?)(?=\*\*)/);

      // 불리한 조항 매칭
      const unfavorableMatch = analysis.match(
        /(?<=\*\*불리한 조항:\*\*\s*)([\s\S]*?)(?=\*\*유리한 조항|\*\*결론|$)/
      );
      // 유리한 조항 매칭
      const favorableMatch = analysis.match(
        /(?<=\*\*유리한 조항:\*\*\s*)([\s\S]*?)(?=\*\*불리한 조항|\*\*결론|$)/
      );
      // 결론 매칭
      const conclusionMatch = analysis.match(/(?<=\*\*결론\*\*\s*)([\s\S]*)/);

      const cleanText = (text) => text.replace(/\*\*/g, "").trim();

      setSectionTitle(titleMatch ? cleanText(titleMatch[0]) : "제목 없음");
      setFavorableClause(
        favorableMatch
          ? cleanText(favorableMatch[0])
          : "분석된 유리한 조항이 없습니다."
      );
      setUnfavorableClause(
        unfavorableMatch
          ? cleanText(unfavorableMatch[0])
          : "분석된 불리한 조항이 없습니다."
      );
      setConclusion(
        conclusionMatch
          ? cleanText(conclusionMatch[0])
          : "분석된 결론이 없습니다."
      );
    }
  }, [analysis]);

  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    stepRefs.current.forEach((step) => {
      if (step) {
        observer.observe(step);
      }
    });

    return () => {
      stepRefs.current.forEach((step) => {
        if (step) {
          observer.unobserve(step);
        }
      });
    };
  }, []);

  return (
    <div>
      <RentHeader />
      <div className="document-result-page">
        <div className="document-result-top">
          <div className="document-result-title">계약서 검사 결과</div>
          <div className="document-result-sub">
            <span style={{ color: "#FF9898", fontWeight: "bold" }}>User</span>
            님의 계약서 분석 결과는 다음과 같습니다.
          </div>
        </div>
        <div className="document-result-analysis">
          <ol className="olcards">
            <div className="step-wrap" ref={(el) => (stepRefs.current[0] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">분석 대상 조항</div>
                  <div className="text"></div>
                </div>
              </li>
              <div
                className="step-text"
                style={{ fontWeight: "bold", textAlign: "center" }}
              >
                {sectionTitle}
              </div>
            </div>

            <div className="step-wrap" ref={(el) => (stepRefs.current[1] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">유리한 조항</div>
                  <div className="text"></div>
                </div>
              </li>
              <div className="step-text">{favorableClause}</div>
            </div>

            <div className="step-wrap" ref={(el) => (stepRefs.current[2] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">불리한 조항</div>
                  <div className="text"></div>
                </div>
              </li>
              <div className="step-text">{unfavorableClause}</div>
            </div>

            <div className="step-wrap" ref={(el) => (stepRefs.current[3] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">결론</div>
                  <div className="text"></div>
                </div>
              </li>
              <div className="step-text">{conclusion}</div>
            </div>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default DocumentResultContainer;
