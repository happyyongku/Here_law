import { useNavigate, useParams } from "react-router-dom";
import CaseTypeCard from "./CaseTypeCard";
import "./CaseType.css";

function CaseType() {
  const { type } = useParams();
  const navigate = useNavigate();

  // axios 코드를 작성해야 한다. params로 받아서 request 보내야함.
  const something = ["", "", ""];

  return (
    <div className="case-type-container">
      <div className="case-type-title-box">
        <div className="case-type-title">{type}</div>
        <div className="case-type-content">
          계약 분쟁, 재산권 분쟁, 채권 채무 관계, 손해배상 청구, 가족 법적 문제,
          부동산 관련 사건 등 다양한 민사 사건에 대한 포스팅을 인공지능을 통해서
          제공합니다.
        </div>
        <button className="case-subscribe-button">SUBSCRIBE</button>
      </div>
      <div className="case-type-content-box">
        {something.map((item, index) => (
          <CaseTypeCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default CaseType;
