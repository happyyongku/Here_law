import { useNavigate } from "react-router-dom";
import "./ViewCard.css";

function ViewCard({ posting }) {
  // console.log(posting.title);
  // console.log(posting.content);
  // console.log(posting.magazine_id);
  // console.log(posting.likes);
  // console.log(posting.created_at);
  // console.log(posting.view_count);
  const navigate = useNavigate();
  return (
    <div
      className="view-card-container"
      //   onClick={() => navigate(`/magazine/${posting.magazine_id}`)}
    >
      {/* 사진 대신 임시로 쓰는 div 태그  */}
      <div className="img-alt"></div>
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
