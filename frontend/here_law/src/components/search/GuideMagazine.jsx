import "./GuideMagazine.css";

function GuideMagazine() {
  return (
    <div className="magazine-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">매거진</div>
        <div className="guide-subtitle">
          인공지능이 작성한 법과 관련된 다양한 법 소식을 받으세요.
        </div>
      </div>

      <div className="guide-result-box">
        <div className="guide-result-magazine">결과1</div>
        <div className="guide-result-magazine">결과2</div>
      </div>
    </div>
  );
}

export default GuideMagazine;
