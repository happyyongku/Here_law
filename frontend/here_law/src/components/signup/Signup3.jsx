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

function Signup3({ onSubmit }) {
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
      <div className="signup-input-title">관심 분야</div>
      <div style={{ opacity: "0.5" }} className="signup-input-title">
        관심 분야의 맞춤형 매거진 포스팅을 추천해드립니다.
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

      <div>
        <button className="signup-next-button" onClick={onSubmit}>
          회원가입 완료
        </button>
      </div>
    </div>
  );
}

export default Signup3;
