import React from "react";
import { useNavigate } from "react-router-dom";
import "./CaseModal.css";
import CloseIcon from "../../assets/mypage/closeimg.png";
import ModalPen from "../../assets/search/modalpen.png";
import ModalArrow from "../../assets/search/modalarrow.gif";

const CaseModal = ({ judgmentSummary, closeModal, artifact }) => {
  const navigate = useNavigate();

  // caseInfoId를 통해 CaseDetail 페이지로 이동하는 함수
  const goToCaseDetail = () => {
    navigate(`/search/case/${artifact}`);
  };

  return (
    <>
      {/* 화면 전체를 덮는 오버레이 */}
      <div className="modal-overlay" onClick={closeModal}></div>

      {/* 모달 창 */}
      <div className="modal">
        <img
          src={CloseIcon}
          alt="close-icon"
          className="case-modal-close"
          onClick={closeModal}
        />
        <div className="case-madal-summary-title">
          판결 요약
          <img src={ModalPen} alt="modal-pen" className="case-modal-pen" />
        </div>
        <hr
          style={{
            backgroundColor: "#F55e00",
            height: "1.4px",
            border: "none",
          }}
        />
        <div className="case-madal-summary-content">{judgmentSummary}</div>

        {/* 판례 상세 보기 버튼 */}
        <button
          onClick={goToCaseDetail}
          style={{ marginTop: "20px" }}
          className="case-modal-detail-go"
        >
          상세 보기{" "}
          <img
            src={ModalArrow}
            alt="case-modal-arrow"
            className="case-modal-arrow"
          />
        </button>
      </div>
    </>
  );
};

export default CaseModal;
