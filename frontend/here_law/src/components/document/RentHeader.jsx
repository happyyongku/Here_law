import "./RentHeader.css";
import RentImage from "../../assets/document/rentimage.png";

function RentHeader() {
  return (
    <div>
      <div className="rent-header">
        <div className="rent-header-text">
          <div className="rent-header-text-title">계약서 분석 및 평가</div>
          <div className="rent-header-text-sub">
            계약서의 주요 조항을 분석해 위험 요소를 평가합니다.
          </div>
        </div>
        <img src={RentImage} alt="rent image" className="rent-image" />
      </div>
    </div>
  );
}

export default RentHeader;
