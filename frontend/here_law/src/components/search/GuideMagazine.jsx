import "./GuideMagazine.css";
import GuideMagazine1 from "../../assets/search/magazine1.gif";
import GuideMagazine2 from "../../assets/search/magazine2.png";
import { useNavigate } from "react-router-dom";

function GuideMagazine() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/magazine/");
  };

  return (
    <div className="magazine-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">매거진</div>
        <div className="guide-subtitle">
          인공지능이 작성한 법과 관련된 다양한 법 소식을 받으세요.
        </div>
      </div>

      <div className="guide-result-box">
        <div
          className="guide-result-magazine"
          onClick={handleNavigate}
          role="button"
          tabIndex={0}
        />
        <div
          className="guide-result-magazine2"
          onClick={handleNavigate}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
}

export default GuideMagazine;
