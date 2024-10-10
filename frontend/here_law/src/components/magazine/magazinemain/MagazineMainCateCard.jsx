import { useNavigate } from "react-router-dom";
import defaultimg from "../../../assets//mypage/defaultimg.png";
import "./MagazineMainCateCard.css";

function MagazineMainCateCard({ item, index }) {
  const navigate = useNavigate();
  // console.log(item);

  return (
    <div className="magazine-main-cate-card">
      {/* <div className="cate-card-img"></div> */}
      <img src={defaultimg} alt="" className="cate-card-img" />
      <button
        className="cate-card-title"
        onClick={() => {
          navigate(`case/${item}`);
        }}
      >
        {item}
      </button>
    </div>
  );
}

export default MagazineMainCateCard;
