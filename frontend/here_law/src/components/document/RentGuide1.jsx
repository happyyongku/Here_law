import "./RentGuide1.css";
import Check from "../../assets/document/check.png";

function RentGuide1() {
  return (
    <div className="document-guide-page">
      <div className="document-guide-top">
        <div className="document-guide-title">등기부등본 확인</div>
        <img src={Check} alt="check" className="document-check-icon" />
      </div>
    </div>
  );
}

export default RentGuide1;
