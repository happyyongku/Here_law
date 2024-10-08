import React, { useState } from "react";

import "./SojangInputContainer2.css";
import LightIcon from "../../assets/search/light.gif";
import SojangIcon from "../../assets/document/sojang.png";

import axiosInstance from "../../utils/axiosInstance";

function SojangInputContainer2() {
  const [isTipVisible, setIsTipVisible] = useState(false); // 제목 TIP 표시 상태 관리

  const [address, setAddress] = useState("");
  const [subAddress, setSubAddress] = useState("");

  const handleAddressSearch = () => {
    // 카카오 주소 검색 API 호출
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색한 주소 데이터를 state에 저장
        setAddress(data.address);
      },
    }).open();
  };

  const handleFocus = () => {
    setIsTipVisible(true); // input 클릭 시 TIP 표시
  };

  //   const handleBlur = () => {
  //     setIsTipVisible(false); // input focus 해제 시 TIP 숨기기
  //   };

  return (
    <div className="sojang-input-container">
      <div className="sojang-header">
        <div>Tip</div>
        <div>아래 내용을 입력하면 소장이 양식에 맞게 생성됩니다.</div>
      </div>

      <div className="sojang-page2">
        <div className="sojang-title-title">
          <div>소장 작성</div>
          <img src={SojangIcon} alt="sojang-icon" className="sojang-icon" />
        </div>

        <div className="sojang-title-box">
          <div>사건 제목</div>
          <input
            type="text"
            placeholder="사건 제목을 입력해주세요"
            className="sojang-title-box-input"
            onFocus={handleFocus}
            // onBlur={handleBlur}
          />
        </div>

        {/* TIP 부분이 input 클릭 시에만 표시 */}
        {isTipVisible && (
          <div className="sojang-tip">
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              <img
                src={LightIcon}
                alt="light-icon"
                className="sojang-light-icon"
              />
              작성 TIP
            </div>
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              사건 제목 한 개를 구체적으로 작성해주세요. ex) 사기 혐의에 대한
              손해배상 청구 소송
            </div>
          </div>
        )}

        <div className="sojang-wongo-box">
          <div>
            원고
            <span
              style={{ fontSize: "13px", color: "#8C8C8C", fontWeight: "500" }}
            >
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> *</span>{" "}
              소송을 제기하여 재판을 청구한 사람.
            </span>
          </div>
          <input
            type="text"
            placeholder="원고를 입력하세요"
            className="sojang-wongo-input"
          />
        </div>
        <div className="sojang-address-box2">
          <div>원고 주소</div>
          <div className="sojang-main-address-box2">
            <input
              className="sojang-main-address2"
              type="text"
              value={address}
              readOnly
            />
            <button
              className="sojang-address-button2"
              onClick={handleAddressSearch}
            >
              주소 검색 🔍︎
            </button>
          </div>
          <input
            className="sojang-sub-address2"
            type="text"
            placeholder="상세 주소를 입력하세요"
          />
        </div>
        <div className="sojang-number-box">
          <div>원고 전화번호</div>
          <input
            type="text"
            placeholder="000-0000-0000"
            className="sojang-number-box-input"
          />
        </div>
        {/* 피고 */}
        <div className="sojang-wongo-box">
          <div>
            피고
            <span
              style={{ fontSize: "13px", color: "#8C8C8C", fontWeight: "500" }}
            >
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> *</span>{" "}
              원고에 의해 고소 또는 청구를 당한 사람
            </span>
          </div>
          <input
            type="text"
            placeholder="원고를 입력하세요"
            className="sojang-wongo-input"
          />
        </div>
        <div className="sojang-address-box2">
          <div>피고 주소</div>
          <div className="sojang-main-address-box2">
            <input
              className="sojang-main-address2"
              type="text"
              value={address}
              readOnly
            />
            <button
              className="sojang-address-button2"
              onClick={handleAddressSearch}
            >
              주소 검색 🔍︎
            </button>
          </div>
          <input
            className="sojang-sub-address2"
            type="text"
            placeholder="상세 주소를 입력하세요"
          />
        </div>
        <div className="sojang-number-box">
          <div>피고 전화번호</div>
          <input
            type="text"
            placeholder="000-0000-0000"
            className="sojang-number-box-input"
          />
        </div>

        <div className="sojang-number-box">
          <div>법원명</div>
          <input
            type="text"
            placeholder="법원명을 입력하세요. ex) 서울남부지방법원"
            className="sojang-number-box-input"
          />
        </div>

        <div className="sojang-content-box">
          <div>사건 내용</div>
          <textarea
            placeholder="사건 내용을 시간 순서에 따라 구체적으로 작성해주세요."
            className="sojang-content-box-input"
          />
        </div>
      </div>
      <button className="sojang-submit-button">작성</button>
    </div>
  );
}

export default SojangInputContainer2;
