import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import landing_1 from "../assets/mypage/landing_1.png";
import landing_2 from "../assets/mypage/landing_2.png";
import landing_3 from "../assets/mypage/landing_3.png";
import landing_4 from "../assets/mypage/landing_4.png";

import landing_5_1 from "../assets/mypage/landing_5_1.png";
import landing_5_2 from "../assets/mypage/landing_5_2.png";
import landing_5_3 from "../assets/mypage/landing_5_3.png";
import landing_5_4 from "../assets/mypage/landing_5_4.png";
import landing_5_5 from "../assets/mypage/landing_5_5.png";
import landing_5_6 from "../assets/mypage/landing_5_6.png";

function Landing() {
  const navigate = useNavigate();

  const refSection1 = useRef(null);
  const refSection2 = useRef(null);
  const refSection3 = useRef(null);
  const refSection4 = useRef(null);
  const refSection5 = useRef(null);
  const refSection6 = useRef(null);

  useEffect(() => {
    const sections = [
      refSection1,
      refSection2,
      refSection3,
      refSection4,
      refSection5,
      refSection6,
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="landing-container">
      {/* 섹션 1 */}
      <div className="section" ref={refSection1}>
        <div className="section-content">
          <div className="leftSection">
            <h1 className="title">법률 서비스를, 더 쉽게.</h1>
            <h1 className="title">AI 판례 요약 서비스</h1>
            <p className="subTitle">
              복잡한 판례를 AI를 통해 간단하게 요약된 판례를 이용하세요.
            </p>
            <button className="startBtn section1-btn" onClick={() => navigate("/login")}>
              서비스 이용하기
            </button>
          </div>
          <div className="rightSection">
            <img src={landing_1} alt="landing1_img" className="lawImage rightImage" />
          </div>
        </div>
      </div>

      {/* 섹션 2 */}
      <div className="section" ref={refSection2}>
        <div className="section-content">
          <div className="leftSection">
            <img src={landing_2} alt="landing2_img" className="lawImage leftImage" />
          </div>
          <div className="rightSection">
            <h2 className="sectionTitle">복잡한 법률 문서를 간단하게</h2>
            <p className="sectionContent">
              AI가 판례를 분석하여 핵심 내용을 빠르게 파악할 수 있도록 도와드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* 섹션 3 */}
      <div className="section" ref={refSection3}>
        <div className="section-content">
          <div className="leftSection">
            <h2 className="sectionTitle">시간 절약</h2>
            <p className="sectionContent">
              긴 문서를 읽는 데 소비되는 시간을 줄이고, 핵심만 파악하세요.
            </p>
          </div>
          <div className="rightSection">
            <img src={landing_3} alt="landing3_img" className="lawImage rightImage" />
          </div>
        </div>
      </div>

      {/* 섹션 4 */}
      <div className="section" ref={refSection4}>
        <div className="section-content-center">
          <h2 className="sectionTitle">정확한 정보</h2>
          <p className="sectionContent">
            AI가 정확하고 신뢰할 수 있는 요약 정보를 제공합니다.
          </p>
          <img src={landing_4} alt="landing4_img" className="lawImage centerImage" />
        </div>
      </div>

      {/* 섹션 5 */}
      <div className="section" ref={refSection5}>
        <div className="section-content-center">
          <p className="subTitle">
            사용자 친화적 인터페이스
          </p>
          <p className="sectionTitle">
            누구나 쉽게 사용할 수 있는 간단한 인터페이스를 제공합니다.
          </p>
          <div className="slider">
            <div className="slideTrack">
              {[
                landing_5_1,
                landing_5_2,
                landing_5_3,
                landing_5_4,
                landing_5_5,
                landing_5_6,
                landing_5_1,
                landing_5_2,
                landing_5_3,
                landing_5_4,
                landing_5_5,
                landing_5_6,
              ].map((item, idx) => {
                return (
                  <div className="slide" key={idx}>
                    <img src={item} alt={`landing_5_${idx}`} className="slideImage" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 섹션 6 */}
      <div className="section" ref={refSection6}>
        <div className="section-content-center">
          <h2 className="sectionTitle">지금 바로 시작하세요</h2>
          <button className="startBtn section6-btn" onClick={() => navigate("/login")}>
            서비스 이용하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
