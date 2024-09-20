import lawyerlocationimg from "../../assets/mypage/location.png";

import "./LawyerLocation.css";

function LawyerLocation() {
  return (
    <div className="lawyer-location-container">
      <div className="location-header">
        <h3 className="location-title">위치</h3>
        <div className="location-update">수정하기 &gt;</div>
      </div>
      <div className="location-detail">
        대전광역시 노은동 488-5, 강경민변호사 사무실 2F
      </div>
      <img className="location-map" src={lawyerlocationimg} alt="kakaomap" />
    </div>
  );
}

export default LawyerLocation;
