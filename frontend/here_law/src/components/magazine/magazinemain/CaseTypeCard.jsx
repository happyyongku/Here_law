import { useNavigate } from "react-router-dom";
import postingindeximg from "../../../assets/magazine/postingindeximg.png";
import "./CaseTypeCard.css";

function CaseTypeCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="case-type-card-container">
      <div className="case-type-card-img">이미지</div>
      <div
        className="case-type-card-box"
        onClick={() => {
          navigate(`/magazine/${item.magazine_id}`);
        }}
      >
        <div className="case-type-card-content-header">
          <div className="case-type-card-content-index">
            ● VOL. {item.magazine_id}
          </div>
          <img
            className="case-type-card-content-img"
            src={postingindeximg}
            alt=""
          />
        </div>
        <div className="case-type-card-title">{item.title}</div>
        <div className="case-type-card-content">{item.content}</div>
      </div>
    </div>
  );
}

export default CaseTypeCard;
