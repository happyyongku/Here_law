import { useNavigate } from "react-router-dom";
import postingindeximg from "../../../assets/magazine/postingindeximg.png";
import "./CaseTypeCard.css";

function CaseTypeCard() {
  const navigate = useNavigate();
  return (
    <div className="case-type-card-container">
      <div className="case-type-card-img">이미지</div>
      <div
        className="case-type-card-box"
        // onClick={() => {
        // 뒤에 포스팅 id를 넣어야 한다.
        // navigate("/magazine/1");
        // }}
      >
        <div className="case-type-card-content-header">
          <div className="case-type-card-content-index">● VOL. {}</div>
          <img
            className="case-type-card-content-img"
            src={postingindeximg}
            alt=""
          />
        </div>
        <div className="case-type-card-title">
          온라인 플랫폼과 민사 분쟁: 디지털 경제에서의 새로운 갈등
        </div>
        <div className="case-type-card-content">
          디지털 성장 속의 민사 분쟁의 유형과 해결 방안들
        </div>
      </div>
    </div>
  );
}

export default CaseTypeCard;
