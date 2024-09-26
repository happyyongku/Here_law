import { useState } from "react";
import Card from "./Card";
import SearchIcon from "../../assets/search/searchicon2.png";
import DocumentIcon from "../../assets/search/documenticon.png";
import MagazineIcon from "../../assets/search/magazineicon.png";
import LawyerIcon from "../../assets/search/lawyericon.png";
import "./NaviCard.css";

function NaviCard() {
  const cardData = [
    {
      title: "판례 검색",
      subtitle: "키워드와 Ai 검색으로 판례 찾기",
      icon: SearchIcon,
    },
    {
      title: "법정 문서 분석",
      subtitle: "위험도와 주요 포인트를 분석",
      icon: DocumentIcon,
    },
    {
      title: "변호사 추천",
      subtitle: "무료로 변호사에게 답변 받기",
      icon: LawyerIcon,
    },
    {
      title: "메거진",
      subtitle: "최신 법률 트렌드 포스팅",
      icon: MagazineIcon,
    },
  ];

  return (
    <div className="navicard-page">
      {cardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

export default NaviCard;
