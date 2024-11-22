import { useNavigate } from "react-router-dom";
import defaultimg from "../../../assets/mypage/defaultimg.png";
import "./ViewCard.css";

import Magmain1 from "../../../assets/magazine/magmain5.jpg";
import Magmain2 from "../../../assets/magazine/magmain3.jpg";
import Magmain3 from "../../../assets/magazine/magmain2.jpg";
import Magmain4 from "../../../assets/magazine/magmain4.jpg";

import like from "../../../assets/magazine/like.png";
import view from "../../../assets/magazine/view.png";

function ViewCard({ posting, index = 0 }) {
  const navigate = useNavigate();

  // 이미지 배열 생성
  const images = [Magmain1, Magmain2, Magmain3, Magmain4];

  // 순환하여 이미지 선택
  const selectedImage = images[index % images.length];

  return (
    <div
      className="view-card-container"
      onClick={() =>
        navigate(`/magazine/${posting.magazine_id}`, {
          state: { image1: images[index] },
        })
      }
    >
      <img
        src={selectedImage}
        alt=""
        className="img-alt"
        style={{ cursor: "pointer" }}
        s
      />
      <div className="view-card-content-box" style={{ cursor: "pointer" }}>
        <div className="view-card-title">{posting.title}</div>
        <div className="view-card-date">{posting.created_at}</div>
        <div className="view-card-content">{posting.content}</div>
        <div className="view-card-likes-view">
          <img src={like} alt="like" className="hotposting-icon" />
          <div className="view-card-likes">{posting.likes}</div>
          <img src={view} alt="view" className="hotposting-icon" />
          <div className="view-card-view">{posting.view_count}</div>
        </div>
      </div>
    </div>
  );
}

export default ViewCard;
