import { useState } from "react";
import SearchIcon from "../../assets/search/searchicon2.png";
import DocumentIcon from "../../assets/search/documenticon.png";
import MagazineIcon from "../../assets/search/magazineicon.png";
import LawyerIcon from "../../assets/search/lawyericon.png";
import "./Card.css";

function Card() {
  return (
    <div className="card-box">
      <div className="card-text-wrap">
        <div className="card-title">판례 검색</div>
        <div className="card-subtitle">키워드와 Ai 검색으로 판례 찾기</div>
      </div>
      <div className="card-image-box">
        <img src={SearchIcon} alt="search icon card" className="card-icon" />
      </div>
    </div>
  );
}

export default Card;
