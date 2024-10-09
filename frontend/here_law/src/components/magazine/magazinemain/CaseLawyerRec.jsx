import LawyerDetail from "./LawyerDetail";
import "./CaseLawyerRec.css";

function CaseLawyerRec({ item }) {
  return (
    <div className="lawyer-rec-container">
      {/* <img src="" alt="" /> */}
      {/* 이미지 대용 임시 div 태그 */}
      <div className="lawyer-rec-img"></div>
      <div className="lawyer-rec-text-box">
        <div className="lawyer-rec-nickname">{item.lawyer_name}</div>
        <span className="lawyer-rec-expertise">{item.expertise_main}</span>
        <div className="lawyer-rec-desc">{item.description}</div>
        <div className="lawyer-rec-phone">{item.phone_number}</div>
      </div>

      <LawyerDetail />
    </div>
  );
}

export default CaseLawyerRec;
