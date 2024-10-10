import "./GuideDocument.css";
import Docuguide from "../../assets/search/Docuguide.png";

function GuideDocument() {
  return (
    <div className="document-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">계약서 검사 및 분석</div>
        <div className="guide-subtitle">
          여기로를 통해서 정확하고 빠르게 위험도를 검사해보세요.
        </div>
      </div>

      <div className="guide-result-box">
        <div className="guide-result-document"></div>
        <div className="guide-result-document2"></div>
      </div>
    </div>
  );
}

export default GuideDocument;
