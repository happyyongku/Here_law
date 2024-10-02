import "./RentHeader.css";
import RentImage from "../../assets/document/rentimage.png";

function RentHeader() {
  return (
    <div>
      <div className="rent-header">
        <div className="rent-header-text">
          <div className="rent-header-text-title">전세사기 피해 예방</div>
          <div className="rent-header-text-sub">
            등기부등본을 분석해 위험도를 측정하고 핵심 내용 요약을 제공합니다.
          </div>
        </div>
        <img src={RentImage} alt="rent image" className="rent-image" />
      </div>
    </div>
  );
}

export default RentHeader;
