import { useState } from "react";
import Card from "./Card";
import SearchIcon from "../../assets/search/searchicon2.png";
import DocumentIcon from "../../assets/search/documenticon.png";
import MagazineIcon from "../../assets/search/magazineicon.png";
import LawyerIcon from "../../assets/search/lawyericon.png";
import "./NaviCard.css";

import { useNavigate } from "react-router-dom";

function NaviCard() {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "판례 검색",
      subtitle: "키워드와 Ai 검색으로 판례 찾기",
      icon: SearchIcon,
    },
    {
      title: "법정 계약서 분석",
      subtitle: "계약서의 유불리와 주요 포인트를 분석",
      icon: DocumentIcon,
      path: "/document/upload",
    },
    {
      title: "소장 작성",
      subtitle: "입력값 기반 자동으로 소장 생성",
      icon: LawyerIcon,
      path: "/sojang/input",
    },
    {
      title: "메거진",
      subtitle: "최신 법률 트렌드 포스팅",
      icon: MagazineIcon,
      path: "/magazine",
    },
  ];

  // 카드 클릭 시 네비게이션 함수
  const handleCardClick = (path) => {
    navigate(path); // 클릭한 카드의 경로로 이동
  };

  return (
    <div className="navicard-page">
      {cardData.map((card, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(card.path)} // 카드 클릭 시 경로 이동
          style={{ cursor: "pointer" }} // 마우스 커서를 포인터로 변경
        >
          <Card title={card.title} subtitle={card.subtitle} icon={card.icon} />
        </div>
      ))}
    </div>
  );
}

export default NaviCard;
