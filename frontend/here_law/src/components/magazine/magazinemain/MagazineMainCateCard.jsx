import { useNavigate } from "react-router-dom";
import "./MagazineMainCateCard.css";

function MagazineMainCateCard({ item, index }) {
  const navigate = useNavigate();

  return (
    <div className="magazine-main-cate-card">
      <div className="cate-card-img"></div>
      <button className="cate-card-title">{item}</button>
    </div>
  );
}

export default MagazineMainCateCard;
