import "./ExpertiseCard.css";
import defaultimg from "../../assets/mypage/defaultimg.png";

function ExpertiseCard({ item }) {
  return (
    <div className="expertisecard-container">
      <img className="expertise-img" src={defaultimg} alt="expertise-img" />
      <div className="expertise-cate">{item}</div>
    </div>
  );
}

export default ExpertiseCard;
