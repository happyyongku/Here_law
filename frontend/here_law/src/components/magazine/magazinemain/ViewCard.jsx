import { useNavigate } from "react-router-dom";
import defaultimg from "../../../assets/mypage/defaultimg.png";
import "./ViewCard.css";
import Magmain1 from "../../../assets/magazine/magmain5.jpg";
import Magmain2 from "../../../assets/magazine/magmain3.jpg";
import Magmain3 from "../../../assets/magazine/magmain2.jpg";
import Magmain4 from "../../../assets/magazine/magmain4.jpg";

function ViewCard({ posting, index = 0 }) {
  const navigate = useNavigate();

  // 이미지 배열 생성
  const images = [Magmain1, Magmain2, Magmain3, Magmain4];

  // 순환하여 이미지 선택
  const selectedImage = images[index % images.length];

  return (
    <div
      className="view-card-container"
      onClick={() => navigate(`/magazine/${posting.magazine_id}`)}
    >
      {/* 사진 대신 임시로 쓰는 div 태그  */}
      {/* <div className="img-alt"></div> */}
      <img src={selectedImage} alt="" className="img-alt" />
      {/* <img src="" alt="" className="view-card-img" /> */}
      <div className="view-card-content-box">
        <div className="view-card-date">{posting.created_at}</div>
        <div className="view-card-title">{posting.title}</div>
        <div className="view-card-content">{posting.content}</div>
        <div className="view-card-likes-view">
          <img src="" alt="" />
          <div className="view-card-likes">{posting.likes}</div>
          <img src="" alt="" />
          <div className="view-card-view">{posting.view_count}</div>
        </div>
      </div>
    </div>
  );
}

export default ViewCard;
