import SubscribeCard from "./SubscribeCard";

import "./Subscribe.css";
import addsubscribe from "../../assets/mypage/addexpertise.png";

function Subscribe({ subscribe }) {
  return (
    <div className="Subscribe-container">
      <div className="Subscribe-header">
        <h3 className="Subscribe-header-title">구독</h3>
        <img className="add-Subscribe-item" src={addsubscribe} alt="addimg" />
      </div>
      <div className="Subscribe-list">
        {subscribe.map((item, index) => (
          <SubscribeCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Subscribe;
