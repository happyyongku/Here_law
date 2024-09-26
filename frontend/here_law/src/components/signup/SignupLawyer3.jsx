import React, { useEffect, useState } from "react";

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

function SignupLawyer3({
  onSubmit,
  // interest,
  setInterest,
  // officeLocation,
  setOfficeLocation,
  // expertise,
  setExpertise,
}) {
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
    setOfficeLocation(`${address} ${detailAddress}`);
  }, [address, detailAddress]);

  // 주소 입력하는 창
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

  const expertiseCate = [
    "민사법",
    "부동산",
    "건설",
    "재개발, 재건축",
    "의료",
    "손해배상",
    "교통사고",
    "임대차관련법",
    "국가계약",
    "민사집행",
    "채권추심",
    "등기",
    "상사법",
    "회사법",
    "인수합병",
    "도산",
    "증권",
    "금융",
    "보험",
    "해상",
    "무역",
    "조선",
    "중재",
    "IT",
    "형사법",
    "군형법",
    "가사법",
    "상속",
    "이혼",
    "소년법",
    "행정법",
    "공정거래",
    "방송통신",
    "헌법재판",
    "환경",
    "에너지",
    "수용 및 보상",
    "식품, 의약",
    "노동법",
    "산재",
    "조세법",
    "법인세",
    "관세",
    "상속증여세",
    "국제조세",
    "지적재산권법",
    "특허",
    "상표",
    "저작권",
    "영업비밀",
    "언테테인먼트",
    "국제관계법",
    "국제거래",
    "국제중재",
    "이주 및 비자",
    "해외 투자",
    "스포츠",
    "종교",
    "성년후견",
  ];

  const toggleExpert = (name) => {
    setSelectedInterests((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(name)) {
        newSelected.delete(name);
        setExpertise((prevExpertise) =>
          prevExpertise.filter((item) => item !== name)
        ); // 배열에서 제거
      } else {
        newSelected.add(name);
        setExpertise((prevExpertise) => [...prevExpertise, name]); // 배열에 추가
      }
      return newSelected;
    });
  };

  return (
    <div>
      {/* 전문분야 입력 */}
      <div className="expertise-container">
        <div className="expertise-header">
          <h3 className="expertise-header-title">전문 분야</h3>
          <div className="expertise-header-content">
            전문 분야를 선택해 주세요
          </div>
        </div>
        <div className="expert-items-box">
          {expertiseCate.map((expert, index) => (
            <div
              className={`expert-item ${
                selectedInterests.has(expert) ? "selected" : ""
              }`}
              key={index}
              onClick={() => toggleExpert(expert)}
            >
              {expert}
            </div>
          ))}
        </div>
      </div>

      {/* 관심분야 입력 */}
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

      {/* 주소 입력하는 부분  */}
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

      {/* <div className="signup-input-title">자격 인증</div> */}
      {/* <div className="signup-verify-input-box">
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="변호사 자격 번호를 입력하세요"
        />
        <button className="signup-verify-button-black">인증 요청</button>
      </div> */}
      {/* <div
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
      </div> */}

      <div>
        <button className="signup-next-button" onClick={onSubmit}>
          회원가입 완료
        </button>
      </div>
    </div>
  );
}

export default SignupLawyer3;
