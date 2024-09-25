import defaultimg from "../../assets/mypage/defaultimg.png";

import "./InterestCard.css";

function InterestCard({ item }) {
  return (
    <div className="interestcard-container">
      <img className="interest-img" src={defaultimg} alt="interestimg" />
      <p className="interest-title">{item}</p>
    </div>
  );
}

export default InterestCard;
