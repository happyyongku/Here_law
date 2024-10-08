import { useNavigate } from "react-router-dom";
import "./MagazineCustomCard.css";

function MagazineCustomCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="magazine-custom-card-container">
      <img src="" alt="" className="magazine-custom-card-img" />
      <div onClick={() => navigate(`/magazine/${item.magazine_id}`)}>
        <div className="magazine-custom-card-title">{item.title}</div>
        <div className="magazine-custom-card-etc-info">
          <div className="magazine-custom-view-rec">
            <div className="magazine-custom-view">{item.view_count}</div>
            <div className="magazine-custom-rec">{item.likes}</div>
          </div>
          <div className="magazine-custom-date">{item.created_at}</div>
        </div>
        <div className="magazine-custom-card-content">{item.content}</div>
      </div>
    </div>
  );
}

export default MagazineCustomCard;
