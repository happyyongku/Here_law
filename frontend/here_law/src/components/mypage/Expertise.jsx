import addexpertise from "../../assets/mypage/addexpertise.png";
import ExpertiseCard from "./ExpertiseCard";
import "./Expertise.css";

function Expertise({ expertise }) {
  return (
    <div className="expertise-container">
      <div className="expertise-header">
        <h3 className="expertise-header-title">전문분야</h3>
        <img className="add-expertis-item" src={addexpertise} alt="addimg" />
      </div>
      <div className="expert-list">
        {expertise.map((item, index) => (
          <ExpertiseCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Expertise;
