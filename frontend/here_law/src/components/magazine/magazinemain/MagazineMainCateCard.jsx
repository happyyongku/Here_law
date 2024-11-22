import { useNavigate } from "react-router-dom";
import defaultimg from "../../../assets//mypage/defaultimg.png";
import "./MagazineMainCateCard.css";

import Real from "../../../assets/signup/real.png";
import Key from "../../../assets/signup/key.png";
import Labor from "../../../assets/signup/labor.png";
import Divorce from "../../../assets/signup/divorce.png";
import Criminal from "../../../assets/signup/criminal.png";
import Compensation from "../../../assets/signup/compensation.png";
import Car from "../../../assets/signup/car.png";
import Cash from "../../../assets/signup/cash.png";
import Family from "../../../assets/signup/family.png";
import Doctor from "../../../assets/signup/doctor.png";
import Administrative from "../../../assets/signup/administrative.png";

function MagazineMainCateCard({ item, index }) {
  const navigate = useNavigate();

  const images = [
    Family,
    Criminal,
    Divorce,
    Real,
    Compensation,
    Labor,
    Cash,
    Car,
    Key,
    Doctor,
    Administrative,
  ];

  console.log("Images Array:", images);

  // 순환하여 이미지 선택
  const selectedImage = images[index % images.length];

  console.log("Selected Image:", selectedImage);

  return (
    <div className="magazine-main-cate-card">
      {/* <div className="cate-card-img"></div> */}
      <img
        src={selectedImage}
        alt=""
        className="cate-card-img"
        onClick={() => {
          navigate(`case/${item}`);
        }}
        style={{ cursor: "pointer" }}
      />
      <button
        className="cate-card-title"
        onClick={() => {
          navigate(`case/${item}`);
        }}
        style={{ cursor: "pointer" }}
      >
        {item}
      </button>
    </div>
  );
}

export default MagazineMainCateCard;
