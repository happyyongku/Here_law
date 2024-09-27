import { useState } from "react";
import "./ExpertiseModal.css";
import close from "../../assets/mypage/closeimg.png";
import axiosInstance from "../../utils/axiosInstance"; // Axios 인스턴스 import

function ExpertiseModal({ expertise, closeModal, getUserData }) {
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

  const [selectedExpertise, setSelectedExpertise] = useState(expertise || []);

  const toggleExpertise = (item) => {
    if (selectedExpertise.includes(item)) {
      setSelectedExpertise(
        selectedExpertise.filter((expert) => expert !== item)
      );
    } else {
      setSelectedExpertise([...selectedExpertise, item]);
    }
  };

  const updateExpertise = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.put(
        "/spring_api/user/profile",
        { lawyerDTO: { expertise: selectedExpertise } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("전문 분야 수정 성공", response.data);
      closeModal();
      getUserData();
    } catch (error) {
      console.error("전문 분야 수정 실패", error);
    }
  };

  return (
    <div className="expertise-modal-container">
      <div className="expertise-modal-content-box">
        <div className="expertise-modal-header">
          <h3>관심분야</h3>
          <img
            className="expertise-modal-close-img"
            src={close}
            alt="closeimg"
            onClick={closeModal}
          />
        </div>
        <div className="expertise-modal-content-item-box">
          {expertiseCate.map((item) => (
            <div
              className={`expertise-modal-content-item ${
                selectedExpertise.includes(item) ? "selected" : ""
              }`}
              key={item}
              onClick={() => toggleExpertise(item)}
            >
              {item}
            </div>
          ))}
        </div>
        <button
          className="expertise-update-complete-button"
          onClick={updateExpertise}
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}

export default ExpertiseModal;
