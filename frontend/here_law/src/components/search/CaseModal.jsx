import React from "react";
import { useNavigate } from "react-router-dom";
import "./CaseModal.css"; // 스타일을 위한 CSS 파일

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
        <button onClick={closeModal}>닫기</button>
        <h2>판결 요약</h2>
        <p>{judgmentSummary}</p>

        {/* 판례 상세 보기 버튼 */}
        <button onClick={goToCaseDetail} style={{ marginTop: "20px" }}>
          판례 상세 보기
        </button>
      </div>
    </>
  );
};

export default CaseModal;
