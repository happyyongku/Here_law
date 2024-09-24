import lawyerlocationimg from "../../assets/mypage/location.png";
import "./LawyerLocation.css";

function LawyerLocation({ officeLocation }) {
  return (
    <div className="lawyer-location-container">
      <div className="location-header">
        <h3 className="location-title">위치</h3>
        <div className="location-update">수정하기 &gt;</div>
      </div>
      <div className="location-detail">{officeLocation}</div>
      <img className="location-map" src={lawyerlocationimg} alt="kakaomap" />
    </div>
  );
}

export default LawyerLocation;
