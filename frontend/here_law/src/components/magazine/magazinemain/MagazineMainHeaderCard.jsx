// import fetchimg from "../../../assets/magazine/fetchimg.png";
import "./MagazineMainHeaderCard.css";

function MagazineMainHeaderCard({ cardTitle, navigateButton, fetchimg }) {
  return (
    <div className="main-header-card">
      <div className="main-header-card-title">{cardTitle}</div>
      <img src={fetchimg} alt="" />
      <div className="main-header-card-button" onClick={navigateButton}>
        바로가기
      </div>
    </div>
  );
}

export default MagazineMainHeaderCard;
