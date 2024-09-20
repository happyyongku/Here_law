import InterestCard from "./InterestCard";
import addinterestimg from "../../assets/mypage/addexpertise.png";
import "./Interest.css";

function Interest() {
  const interest = ["부동산", "형사", "노동"];
  return (
    <div className="interest-container">
      <div className="interest-header">
        <h3 className="interest-header-title">관심분야</h3>
        <img
          className="add-interest"
          src={addinterestimg}
          alt="addinterestimg"
        />
      </div>
      <div className="interest-items">
        {interest.map((item, index) => (
          <InterestCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Interest;
