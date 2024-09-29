import { useState, useEffect } from "react";
import close from "../../assets/mypage/closeimg.png";
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
import "./InterestModal.css";
import axiosInstance from "../../utils/axiosInstance";

function InterestModal({ closeModal, interests, getUserData }) {
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

  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    // 초기 선택된 관심 분야 설정
    setSelectedInterests(interests || []);
  }, [interests]);

  const toggleInterest = (name) => {
    setSelectedInterests((prev) =>
      prev.includes(name)
        ? prev.filter((interest) => interest !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedInterests);
    try {
      const response = await axiosInstance.put(
        "/spring_api/user/profile",
        {
          interests: selectedInterests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("관심 분야 수정 성공", response.data);
      closeModal();
      getUserData();
    } catch (error) {
      console.error("관심 분야 수정 실패", error);
    }
  };

  return (
    <div className="interest-modal-container">
      <div className="interest-modal-content-box">
        <div className="expertise-modal-header">
          <h3>관심분야</h3>
          <img
            className="expertise-modal-close-img"
            src={close}
            alt="closeimg"
            onClick={closeModal}
          />
        </div>
        <div className="interest-modal-body">
          {[interestOptions1, interestOptions2, interestOptions3].map(
            (group, groupIndex) => (
              <div key={groupIndex} className="interest-modal-body-group">
                {group.map((item, index) => (
                  <div
                    key={index}
                    className={`interest-modal-body-item ${
                      selectedInterests.includes(item.name) ? "selected" : ""
                    }`}
                    onClick={() => toggleInterest(item.name)}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div className="interest-modal-item-title">{item.name}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <button
          className="interest-modal-update-complete"
          onClick={handleSubmit}
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}

export default InterestModal;
