import { useNavigate, useParams } from "react-router-dom";
import postingindeximg from "../../../assets/magazine/postingindeximg.png";

import { useSelector } from "react-redux";

import "./CaseTypeCard.css";
import { useEffect, useState } from "react";

function CaseTypeCard({ item, index }) {
  const array1 = useSelector((state) => state.array.array1);
  console.log(array1);
  const navigate = useNavigate();

  const { type } = useParams();

  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (type === "가족법") {
      setNumber(0);
    } else if (type === "형사법") {
      setNumber(8);
    } else if (type === "민사법") {
      setNumber(16);
    } else if (type === "부동산 및 건설") {
      setNumber(24);
    } else if (type === "회사 및 상사법") {
      setNumber(32);
    } else if (type === "국제 및 무역법") {
      setNumber(40);
    } else if (type === "노동 및 고용법") {
      setNumber(48);
    } else if (type === "조세 및 관세법") {
      setNumber(56);
    } else if (type === "지적재산권") {
      setNumber(64);
    } else if (type === "의료 및 보험법") {
      setNumber(72);
    } else {
      setNumber(80); // 기본 배열 유지
    }
  }, [type]); // type이 변경될 때만 실행

  return (
    <div className="case-type-card-container">
      <img src={array1[index + number]} alt="" className="case-type-card-img" />
      {/* <div className="case-type-card-img">이미지</div> */}
      <div
        className="case-type-card-box"
        onClick={() => {
          navigate(`/magazine/${item.magazine_id}`, {
            state: { image1: array1[index + number] },
          });
        }}
      >
        <div className="case-type-card-content-header">
          <div className="case-type-card-content-index">
            ● VOL. {item.magazine_id}
          </div>
          <img
            className="case-type-card-content-img"
            src={postingindeximg}
            alt=""
          />
        </div>
        <div className="case-type-card-title">{item.title}</div>
        <div className="case-type-card-content">{item.content}</div>
      </div>
    </div>
  );
}

export default CaseTypeCard;
