import React, { useState } from "react";

import criminalImage from "../../assets/signup/criminal.png";
import laborImage from "../../assets/signup/labor.png";
import carImage from "../../assets/signup/car.png";
import keyImage from "../../assets/signup/key.png";
import realImage from "../../assets/signup/real.png";
import docImage from "../../assets/signup/doc.png";
import compensationImage from "../../assets/signup/compensation.png";
import divorceImage from "../../assets/signup/divorce.png";
import familyImg from "../../assets/signup/family.png";
import cashImg from "../../assets/signup/cash.png";

function SignupLawyer3({ onSubmit }) {
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const interestOptions = [
    { icon: criminalImage, name: "형사" },
    { icon: keyImage, name: "임대차" },
    { icon: carImage, name: "교통사고" },
    { icon: laborImage, name: "노동" },
    { icon: realImage, name: "부동산" },
    { icon: realImage, name: "부동산" },
    { icon: docImage, name: "계약서" },
    { icon: compensationImage, name: "손해배상" },
    { icon: divorceImage, name: "이혼" },
    { icon: familyImg, name: "상속/가사" },
    { icon: cashImg, name: "대여금" },

    // 추가
  ];

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setAddress(fullAddress);
        document.getElementById("detailAddress").focus();
      },
    }).open();
  };

  return (
    <div>
      <div className="signup-input-title">전문 분야</div>
      <div style={{ opacity: "0.5" }} className="signup-input-title">
        최대 3개의 전문분야를 선택하세요.
      </div>
      <div className="signup-law-choice-wrap">
        {interestOptions.map((option) => (
          <div
            className="signup-law-content"
            key={option.name}
            onClick={() => toggleInterest(option.name)}
          >
            <img
              src={option.icon}
              alt={option.name}
              style={{ width: "50px", height: "50px" }}
            />
            <div>{option.name}</div>
          </div>
        ))}
      </div>

      <div className="signup-input-title">사무실 위치</div>

      <button onClick={openAddressSearch} className="signup-address-button">
        <div>주소 검색 🔍︎</div>
      </button>

      <div style={{ marginTop: "8px" }} className="signup-input-box">
        <input
          type="text"
          className="signup-input-tag"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          readOnly
        />
      </div>
      <div style={{ marginTop: "8px" }} className="signup-input-box">
        <input
          id="detailAddress"
          type="text"
          className="signup-input-tag"
          placeholder="상세 주소를 입력해 주세요"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </div>

      <div className="signup-input-title">자격 인증</div>
      <div className="signup-verify-input-box">
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="변호사 자격 번호를 입력하세요"
        />
        <button className="signup-verify-button-black">인증 요청</button>
      </div>
      <div
        style={{
          border: "none",
          borderBottom: "1px solid #d7dedd",
          marginTop: "8px",
        }}
        className="signup-verify-input-box"
      >
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="인증번호를 입력해주세요"
        />
        <button className="signup-verify-button-orange">인증</button>
      </div>

      <div>
        <button className="signup-next-button" onClick={onSubmit}>
          회원가입 완료
        </button>
      </div>
    </div>
  );
}

export default SignupLawyer3;
