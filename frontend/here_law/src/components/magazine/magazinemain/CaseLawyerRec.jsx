function CaseLawyerRec({ item }) {
  return (
    <div className="lawyer-rec-container">
      {/* <img src="" alt="" /> */}
      {/* 이미지 대용 임시 div 태그 */}
      <div className="lawyer-rec-img"></div>
      <div className="lawyer-rec-text-box">
        <div className="lawyer-rec-nickname">nickname</div>
        <div className="lawyer-rec-expertise">expertise_main</div>
        <div className="lawyer-rec-desc">description</div>
        <div className="lawyer-rec-phone">user_phone</div>
      </div>
    </div>
  );
}

export default CaseLawyerRec;
