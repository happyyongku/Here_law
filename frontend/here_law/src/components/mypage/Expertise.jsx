import addexpertise from "../../assets/mypage/addexpertise.png";
import ExpertiseCard from "./ExpertiseCard";
import ExpertiseModal from "./ExpertiseModal";
import "./Expertise.css";
import { useState } from "react";

function Expertise({ expertise, getUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="expertise-container11">
      <div className="expertise-header11">
        <h3 className="expertise-header-title11">전문분야</h3>
        <img
          className="add-expertis-item11"
          src={addexpertise}
          alt="addimg"
          onClick={openModal}
        />
      </div>
      <div className="expert-list11">
        {expertise.map((item, index) => (
          <ExpertiseCard key={index} item={item} />
        ))}
      </div>

      {isModalOpen && (
        <ExpertiseModal
          getUserData={getUserData}
          expertise={expertise}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default Expertise;
