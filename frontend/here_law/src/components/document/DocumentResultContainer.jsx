import React, { useState, useEffect, useRef } from "react";
import RentHeader from "./RentHeader";
import { useLocation } from "react-router-dom";
import "./DocumentResultContainer.css";
import LightIcon from "../../assets/search/light.gif";

function DocumentResultContainer() {
  const location = useLocation();
  const { analysis } = location.state || {}; // 전달된 state의 analysis 추출
  console.log(analysis);

  // 분석대상조항, 유리한 조항, 불리한 조항, 결론을 분리
  const [sectionTitle, setSectionTitle] = useState("");
  const [targetClause, setTargetClause] = useState(""); // 분석대상조항 추가
  const [favorableClause, setFavorableClause] = useState("");
  const [unfavorableClause, setUnfavorableClause] = useState([]);
  const [conclusion, setConclusion] = useState("");

  useEffect(() => {
    if (analysis) {
      // 분석 결과 파싱 함수
      const parseAnalysis = (analysisResult) => {
        const result = {
          sectionTitle: "",
          targetClause: "", // 분석대상조항 추가
          favorable: "",
          unfavorable: [],
          conclusion: "",
        };

        // 0. "제"로 시작하는 제목 파싱
        let pattern = /(?<=\*\*)제[0-9]+조.*?(?=\*\*)/;
        let match = analysisResult.match(pattern);
        if (match) {
          result.sectionTitle = match[0].trim();
        }
        // 1. "불리한 조항" 안의 "- ... :" 형식 파싱
        pattern = /-\s*(.*?)(?=:)/g; // ":" 직전까지 추출하도록 수정
        let targetMatches = [...analysisResult.matchAll(pattern)];
        if (targetMatches.length > 0) {
          result.targetClause = targetMatches
            .map((match) => match[1].trim())
            .join(", ");
        }

        // 2. "유리한 조항"과 "불리한 조항" 형식 파싱
        pattern = /1\.\s*유리한 조항:(.*?)(?=\n2\. 불리한 조항:|$)/s;
        match = analysisResult.match(pattern);
        if (match) {
          result.favorable = match[1].trim();
        }

        // 3. "1. 불리한 조항:" 이후 "2. 결론:" 전까지의 모든 내용 파싱
        pattern = /1\.\s*불리한 조항:(.*?)(?=\n2\. 결론:|$)/s;
        match = analysisResult.match(pattern);
        if (match) {
          // 불리한 조항을 파싱하여 강조할 부분과 나머지 내용을 분리
          result.unfavorable = match[1]
            .split(/(?:\n|-) +/)
            .map((item) => {
              const parts = item.split(":");
              return {
                highlight: parts[0].trim(), // -와 : 사이의 강조할 부분
                content: parts.slice(1).join(":").trim(), // 그 이후의 내용
              };
            })
            .filter((item) => item.highlight.length > 0);
        }
        // 4. 결론 파싱
        pattern = /결론:(.*)/s;
        match = analysisResult.match(pattern);
        if (match) {
          result.conclusion = match[1].trim();
        }

        // 기본값 설정
        result.sectionTitle = result.sectionTitle || "제목 없음";
        result.targetClause =
          result.targetClause || "분석된 대상 조항이 없습니다.";
        result.favorable = result.favorable || "분석된 유리한 조항이 없습니다.";
        result.unfavorable =
          result.unfavorable.length > 0
            ? result.unfavorable
            : [{ highlight: "", content: "분석된 불리한 조항이 없습니다." }];
        result.conclusion = result.conclusion || "분석된 결론이 없습니다.";

        return result;
      };

      // 분석 결과 파싱 및 상태 업데이트
      const parsed = parseAnalysis(analysis);
      setSectionTitle(parsed.sectionTitle);
      setTargetClause(parsed.targetClause); // 분석대상조항 설정
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
                style={{
                  fontWeight: "bold",
                  textAlign: "start",

                  alignItems: "center",
                }}
              >
                <span style={{ listStyleType: "disc" }}>
                  {" "}
                  <img
                    src={LightIcon}
                    alt="light-icon"
                    className="light-icon-docu-result"
                  />
                </span>
                <span>{targetClause}</span>
              </div>
            </div>

            {/* <div className="step-wrap" ref={(el) => (stepRefs.current[1] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">유리한 조항</div>
                  <div className="text"></div>
                </div>
              </li>
              <div className="step-text">{favorableClause}</div>
            </div> */}

            <div className="step-wrap" ref={(el) => (stepRefs.current[2] = el)}>
              <li style={{ "--cardColor": "#9AC3FF" }}>
                <div className="content">
                  <div className="icon">✓</div>
                  <div className="step-title">불리한 조항</div>
                  <div className="text"></div>
                </div>
              </li>
              <div className="step-text">
                {unfavorableClause.map((clause, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",

                      gap: "20px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ listStyleType: "disc" }}></span>
                    <div>
                      <div
                        style={{
                          color: "#FF9900",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                        {clause.highlight}:
                      </div>
                      <hr />
                      <br />
                      <div style={{ marginBottom: "30px" }}>
                        {clause.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
