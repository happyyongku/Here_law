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
      // 분석 결과 파싱 함수
      const parseAnalysis = (analysisResult) => {
        const result = {
          sectionTitle: "",
          favorable: "",
          unfavorable: "",
          conclusion: "",
        };

        // 0. "제"로 시작하는 제목 파싱
        let pattern = /(?<=\*\*)제[0-9]+조.*?(?=\*\*)/;
        let match = analysisResult.match(pattern);
        if (match) {
          result.sectionTitle = match[0].trim();
        }

        // 1. "1. 유리한 조항"과 "2. 불리한 조항" 형식 파싱
        pattern = /1\.\s*유리한 조항:(.*?)(?=\n2\. 불리한 조항:|$)/s;
        match = analysisResult.match(pattern);
        if (match) {
          result.favorable = match[1].trim();
        }

        pattern = /2\.\s*불리한 조항:(.*?)(?=\n결론:|$)/s;
        match = analysisResult.match(pattern);
        if (match) {
          result.unfavorable = match[1].trim();
        }

        pattern = /결론:(.*)/s;
        match = analysisResult.match(pattern);
        if (match) {
          result.conclusion = match[1].trim();
        }

        // 2. "유리한 조항", "불리한 조항" 텍스트만 있는 형식 파싱
        if (!result.favorable) {
          pattern = /유리한 조항[:\s]*(.*?)(?=\n불리한 조항|$)/s;
          match = analysisResult.match(pattern);
          if (match) {
            result.favorable = match[1].trim();
          }
        }

        if (!result.unfavorable) {
          pattern = /불리한 조항[:\s]*(.*?)(?=\n결론|$)/s;
          match = analysisResult.match(pattern);
          if (match) {
            result.unfavorable = match[1].trim();
          }
        }

        if (!result.conclusion) {
          pattern = /결론[:\s]*(.*)/s;
          match = analysisResult.match(pattern);
          if (match) {
            result.conclusion = match[1].trim();
          }
        }

        // 만약 유리한 조항, 불리한 조항, 결론이 비어 있으면 기본값 설정
        result.sectionTitle = result.sectionTitle || "제목 없음";
        result.favorable = result.favorable || "분석된 유리한 조항이 없습니다.";
        result.unfavorable =
          result.unfavorable || "분석된 불리한 조항이 없습니다.";
        result.conclusion = result.conclusion || "분석된 결론이 없습니다.";

        return result;
      };

      // 분석 결과 파싱 및 상태 업데이트
      const parsed = parseAnalysis(analysis);
      setSectionTitle(parsed.sectionTitle);
      setFavorableClause(parsed.favorable);
      setUnfavorableClause(parsed.unfavorable);
      setConclusion(parsed.conclusion);
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
