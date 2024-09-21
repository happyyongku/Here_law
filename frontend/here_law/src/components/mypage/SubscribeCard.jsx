import defaultimg from "../../assets/mypage/defaultimg.png";
import "./SubscribeCard.css";

function SubscribeCard({ item }) {
  return (
    <div className="subscribecard-container">
      <img className="subscribe-img" src={defaultimg} alt="subscribe-img" />
      <div className="subscribe-cate">{item}</div>
    </div>
  );
}

export default SubscribeCard;
