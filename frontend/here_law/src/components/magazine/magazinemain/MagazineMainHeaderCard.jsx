import "./MagazineMainHeaderCard.css";

function MagazineMainHeaderCard({ cardTitle, navigateButton }) {
  return (
    <div className="main-header-card">
      {/* main-header-card를 이미지로 채워야한다 */}
      <div className="main-header-card-title">{cardTitle}</div>
      <div className="main-header-card-button" onClick={navigateButton}>
        바로가기
      </div>
    </div>
  );
}

export default MagazineMainHeaderCard;
