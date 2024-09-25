import "./GuideDocument.css";

function GuideDocument() {
  return (
    <div className="document-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">더 빠르고 정확한 검사</div>
        <div className="guide-subtitle">
          여기로를 통해서 정확하고 빠르게 위험도를 검사해보세요.
        </div>
      </div>

      <div className="guide-result-box">
        <div className="guide-result-document">결과1</div>
        <div className="guide-result-document">결과2</div>
      </div>
    </div>
  );
}

export default GuideDocument;
