import { useNavigate } from "react-router-dom";
import like from "../../../assets/magazine/like.png";
import view from "../../../assets/magazine/view.png";

import suryun from "../../../assets/magazine/suryun.jpg";
import gukbang from "../../../assets/magazine/gukbang.jfif";
import bogun from "../../../assets/magazine/bogun.jfif";
import army from "../../../assets/magazine/army.jfif";
import doctor from "../../../assets/magazine/doctor.jpeg";

import "./MagazineCustomCard.css";

function MagazineCustomCard({ item, index }) {
  const imgArray = [suryun, army, bogun, gukbang, doctor];

  const navigate = useNavigate();
  return (
    <div className="magazine-custom-card-container">
      <img
        src={imgArray[index]}
        alt="my-rec-img"
        className="magazine-custom-card-img"
      />
      <div
        onClick={() =>
          navigate(`/magazine/${item.magazine_id}`, {
            state: { image1: imgArray[index] },
          })
        }
      >
        <div className="magazine-custom-card-title">{item.title}</div>
        <div className="magazine-custom-card-etc-info">
          <div className="magazine-custom-date">{item.created_at}</div>
          <div className="magazine-custom-view-rec">
            <img src={view} alt="view" className="magazine-like-icon" />
            <div className="magazine-custom-view">{item.view_count}</div>
            <img src={like} alt="like" className="magazine-like-icon" />
            <div className="magazine-custom-rec">{item.likes}</div>
          </div>
        </div>
        <div className="magazine-custom-card-content">{item.content}</div>
      </div>
    </div>
  );
}

export default MagazineCustomCard;
