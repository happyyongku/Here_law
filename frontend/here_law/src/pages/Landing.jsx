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

// 로고
import logo_white from "../assets/common/logo_white.gif";
import searchif from "../assets/landing/searchif.png";
import aisearchif from "../assets/landing/aisearchif.png";
import magazinepage from "../assets/landing/magazinepage.png";
import magazinepage2 from "../assets/landing/magazinepage2.png";
import magazinepage3 from "../assets/landing/magazinepage3.png";
import gaeyack from "../assets/landing/gaeyack.png";
import sojang from "../assets/landing/sojang.png";

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
            <h1 className="title">법률 서비스를 더 쉽게</h1>
            <h1 className="title">AI 판례 요약 서비스</h1>
            <p className="subTitle">
              복잡한 판례를 AI를 통해 간단하게 요약된 판례를 이용하세요.
            </p>
            <button
              className="startBtn section1-btn"
              onClick={() => navigate("/login")}
            >
              서비스 이용하기
            </button>
          </div>

          <div className="rightSection">
            <img
              src={logo_white}
              alt="landing1_img"
              className="lawImage rightImage"
            />
          </div>
        </div>
      </div>

      {/* 섹션 2 */}
      <div className="section" ref={refSection2}>
        <div className="section-content">
          <div className="leftSection landing2left">
            <img
              src={aisearchif}
              alt="landing2_img"
              className="lawImage leftImage searchifimg1"
            />
            <img
              src={searchif}
              alt="landing2_img"
              className="lawImage leftImage searchifimg2"
            />
          </div>
          <div className="rightSection rightsection2">
            <h2 className="sectionTitle sectiontitle2">
              키워드 검색과 AI 검색
            </h2>
            <p className="sectionContent sectioncontent2">
              키워드 검색을 제공하며, AI를 활용하여 구체적인 검색 방법을 모를 시
              자신의 상황을 프롬프트에 적어 적절한 판례를 검색할 수있는 기증을
              제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 섹션 3 */}
      <div className="section" ref={refSection3}>
        <div className="section-content">
          <div className="leftSection section3">
            <h2 className="sectionTitle">
              매거진으로 제공하는 <br /> 다양한 정보
            </h2>
            <p className="sectionContent sectioncontent3">
              법과 관련된 다양한 정보를 감지하고 이를 기반으로 <br /> 실생활에
              유용한 정보들을 기사화해주며, 법재정에 대한 <br /> 복잡한 정보를
              보기쉽고 간단하게 제공합니다.
            </p>
          </div>
          <div className="rightSection landingsection3">
            <img
              src={magazinepage3}
              alt="landing3_img"
              className="lawImage rightImage magazinepage3"
            />
            <img
              src={magazinepage2}
              alt="landing3_img"
              className="lawImage rightImage magazinepage2"
            />
            <img
              src={magazinepage}
              alt="landing3_img"
              className="lawImage rightImage magazinepage"
            />
          </div>
        </div>
      </div>

      {/* 섹션 4 */}
      <div className="section" ref={refSection4}>
        <div className="section-content-center">
          <div className="forthsection">
            <div className="landingsection4">
              <h2 className="sectionTitle sectiontitle4">
                간편하게 작성하는, 소장 <br /> 안전하게 분석하는, 계약서
              </h2>
              <p className="sectionContent sectioncontent4">
                법이 익숙하지 않은 이용자는 간단한 입력폼을 통해 편하게 소장을
                작성해보세요. <br /> 또한, 계약시 유의해야 할 계약 유불리에 대해
                간단하고 <br /> 안전하게 분석하는 서비스를 제공합니다.
              </p>
            </div>
          </div>
          <div className="landingimgbox4">
            <img
              src={gaeyack}
              alt="landing4_img"
              className="lawImage centerImage landingimg4-1"
            />
            <img
              src={sojang}
              alt="landing4_img"
              className="lawImage centerImage landingimg4-2"
            />
          </div>
        </div>
      </div>

      {/* 섹션 6 */}
      <div className="section" ref={refSection6}>
        <div className="section-content-center">
          <h2 className="sectionTitle lasttitle">Here, Law</h2>
          <div className="lastdesc">지금 이용해보세요</div>
          <button
            className="startBtn section6-btn"
            onClick={() => navigate("/login")}
          >
            서비스 이용하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
