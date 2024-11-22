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

function Signup3({ onSubmit, interest, setInterest }) {
  const [selectedInterests, setSelectedInterests] = useState(new Set());

  const interestOptions1 = [
    { icon: criminalImage, name: "가족법" },
    { icon: keyImage, name: "형사법" },
    { icon: carImage, name: "민사법" },
    { icon: laborImage, name: "부동산 및 건설" },
  ];

  const interestOptions2 = [
    { icon: realImage, name: "회사 및 상사법" },
    { icon: realImage, name: "국제 및 무역법" },
    { icon: docImage, name: "노동 및 고용법" },
    { icon: compensationImage, name: "조세 및 관세법" },
  ];

  const interestOptions3 = [
    { icon: divorceImage, name: "지적재산권" },
    { icon: familyImg, name: "의료 및 보험법" },
    { icon: cashImg, name: "행정 및 공공법" },
  ];

  const toggleInterest = (name) => {
    setSelectedInterests((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(name)) {
        newSelected.delete(name);
        // 상태 업데이트는 useEffect로 감싸지 않아도 됨
        setInterest((prevInterests) =>
          prevInterests.filter((item) => item !== name)
        );
      } else {
        newSelected.add(name);
        setInterest((prevInterests) => [...prevInterests, name]);
      }
      return newSelected;
    });
  };

  return (
    <div>
      <div className="signup-input-title">관심 분야</div>
      <div style={{ opacity: "0.5" }} className="signup-input-title">
        관심 분야의 맞춤형 매거진 포스팅을 추천해드립니다.
      </div>

      <div className="signup-law-choice-wrap">
        <div className="signup-law-select-items-box">
          {interestOptions1.map((interestOption) => (
            <div
              className={`expertise-select-item ${
                selectedInterests.has(interestOption.name) ? "selected" : ""
              }`}
              key={interestOption.name}
              onClick={() => toggleInterest(interestOption.name)}
            >
              <img
                style={{ width: "50px", height: "50px" }}
                src={interestOption.icon}
                alt=""
              />
              <div className="signup-law-content">{interestOption.name}</div>
            </div>
          ))}
        </div>
        <div className="signup-law-select-items-box">
          {interestOptions2.map((interestOption) => (
            <div
              className={`expertise-select-item ${
                selectedInterests.has(interestOption.name) ? "selected" : ""
              }`}
              key={interestOption.name}
              onClick={() => toggleInterest(interestOption.name)}
            >
              <img
                style={{ width: "50px", height: "50px" }}
                src={interestOption.icon}
                alt=""
              />
              <div className="signup-law-content">{interestOption.name}</div>
            </div>
          ))}
        </div>
        <div className="signup-law-select-items-box">
          {interestOptions3.map((interestOption) => (
            <div
              className={`expertise-select-item ${
                selectedInterests.has(interestOption.name) ? "selected" : ""
              }`}
              key={interestOption.name}
              onClick={() => toggleInterest(interestOption.name)}
            >
              <img
                style={{ width: "50px", height: "50px" }}
                src={interestOption.icon}
                alt=""
              />
              <div className="signup-law-content">{interestOption.name}</div>
            </div>
          ))}
        </div>
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
