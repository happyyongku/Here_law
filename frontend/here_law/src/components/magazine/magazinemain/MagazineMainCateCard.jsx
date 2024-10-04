import { useNavigate } from "react-router-dom";
import "./MagazineMainCateCard.css";

function MagazineMainCateCard({ item, index }) {
  const navigate = useNavigate();

  return (
    <div className="magazine-main-cate-card">
      <div className="cate-card-title">{item}</div>
      <div className="cate-card-img"></div>
    </div>
  );
}

export default MagazineMainCateCard;
