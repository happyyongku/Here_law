import React from "react";
import { useLocation } from "react-router-dom";
import "./SojangResultContainer.css";
import SojangIcon from "../../assets/document/sojang.png";

function SojangResultContainer() {
  const location = useLocation();
  const { pdfUrl, previewPdfUrl, docxUrl } = location.state || {};

  console.log(previewPdfUrl);
  return (
    <div className="sojang-result-container">
      <div className="sojang-header">
        <div>결과</div>
        <div>생성된 소장 정보를 확인하세요.</div>
      </div>

      <div className="sojang-result-content">
        <div className="sojang-result-title">
          <img src={SojangIcon} alt="sojang-icon" className="sojang-icon" />
          <div>소장 생성 결과</div>
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

        <div className="sojang-links">
          {pdfUrl && (
            <div>
              <a href={pdfUrl} download="소장.pdf">
                PDF 다운로드
              </a>
            </div>
          )}
          {docxUrl && (
            <div>
              <a href={docxUrl} target="_blank" rel="noopener noreferrer">
                DOCX 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SojangResultContainer;
