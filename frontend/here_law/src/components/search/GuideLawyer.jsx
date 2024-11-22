import "./GuideLawyer.css";
import SojangWrite from "../../assets/search/sojangwrite2.png";
function GuideLawyer() {
  return (
    <div className="lawyer-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">소장 작성</div>
        <div className="guide-subtitle">
          간단한 입력값을 기반으로 소장을 자동으로 생성합니다
        </div>
      </div>

      <div className="guide-sojang-image"></div>
    </div>
  );
}

export default GuideLawyer;
