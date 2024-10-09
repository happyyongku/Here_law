import React from "react";
import { useLocation } from "react-router-dom";

import "./SojangResultContainer.css";
import "./SojangStep2.css";

import SojangIcon from "../../assets/document/sojang.png";

function SojangResultContainer() {
  const location = useLocation();
  const { pdfUrl, previewPdfUrl, docxUrl } = location.state || {};

  console.log(previewPdfUrl);
  return (
    <div className="sojang-result-container">
      <div className="sojang-header">
        <div className="tip-box-result">결과</div>
        <div>생성된 소장 정보를 확인하세요.</div>
      </div>

      <div className="sojang-result-page">
        <div class="progressbar-wrapper">
          <div class="progressbar">
            <div>Step 1</div>
            <div class="active">Step 2</div>
          </div>
        </div>

        <div className="sojang-result-title">
          <div className="sojang-result-title-title">소장 작성 완료</div>
        </div>

        {previewPdfUrl ? (
          <div className="sojang-pdf-viewer">
            <iframe
              src={previewPdfUrl} // previewPdfUrl로 PDF 렌더링
              title="소장 PDF 미리보기"
              width="100%"
              height="1130px"
            />
          </div>
        ) : (
          <div className="sojang-no-preview">
            PDF 미리보기를 가져오지 못했습니다.
          </div>
        )}

        <div className="sojang-down-wrap">
          {pdfUrl && (
            <div>
              <a href={pdfUrl} download="소장.pdf">
                <div className="sojang-down-button">PDF 다운로드</div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SojangResultContainer;
