import { useState } from "react";
import InterestCard from "./InterestCard";
import addinterestimg from "../../assets/mypage/addexpertise.png";
import InterestModal from "./InterestModal";
import "./Interest.css";

function Interest({ interests, getUserData }) {
  // 모달 열고 닫기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="interest-container">
      <div className="interest-header">
        <h3 className="interest-header-title">관심분야</h3>
        <img
          className="add-interest"
          src={addinterestimg}
          alt="addinterestimg"
          onClick={openModal}
        />
      </div>
      <div className="interest-items">
        {interests.map((item, index) => (
          <InterestCard key={index} item={item} />
        ))}
      </div>

      {isModalOpen && (
        <InterestModal
          getUserData={getUserData}
          interests={interests}
          // getUserData={getUserData}
          // expertise={expertise}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default Interest;
