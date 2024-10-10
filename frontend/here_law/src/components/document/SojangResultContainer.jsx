import React from "react";
import { useLocation } from "react-router-dom";

import "./SojangResultContainer.css";
import "./SojangStep2.css";
import axiosInstance from "../../utils/axiosInstance";

import PDFIcon from "../../assets/document/pdficon.png";

function SojangResultContainer() {
  const location = useLocation();
  const { pdfUrl, previewPdfUrl, docxUrl } = location.state || {};
  console.log(docxUrl);
  console.log(previewPdfUrl);

  // docxUrl에서 파일명 부분 추출
  const doc_filename = docxUrl ? docxUrl.split("/").pop() : null;
  console.log(doc_filename);

  // 파일명을 인코딩하여 URL 생성
  const encodedDownloadUrl = `http://3.36.85.129:8000/fastapi_ec2/sojang/download/${encodeURIComponent(
    doc_filename
  )}`;
  console.log(encodedDownloadUrl);

  // Word 파일 다운로드 함수
  const handleWordDownload = async () => {
    try {
      const response = await axiosInstance.get(encodedDownloadUrl, {
        responseType: "blob", // 파일 데이터를 Blob 형식으로 가져옴
      });

      // Blob을 사용하여 파일 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc_filename); // 다운로드할 파일명 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Word 파일 다운로드 실패:", error);
    }
  };

  return (
    <div className="sojang-result-container">
      <div className="sojang-header">
        <div className="tip-box-result">결과</div>
        <div>생성된 소장 정보를 확인하세요.</div>
      </div>

      <div className="sojang-result-page">
        <div className="progressbar-wrapper">
          <div className="progressbar">
            <div>Step 1</div>
            <div className="active">Step 2</div>
          </div>
        </div>

        <div className="sojang-result-title">
          <div className="sojang-result-title-title">
            소장 작성 완료{" "}
            <img src={PDFIcon} alt="pdf-icon" className="sojang-pdf-icon" />{" "}
          </div>
        </div>

        {previewPdfUrl ? (
          <div className="sojang-pdf-viewer">
            <iframe
              src={previewPdfUrl}
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
          {doc_filename && (
            <div onClick={handleWordDownload}>
              <div className="sojang-down-button">Word 다운로드</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SojangResultContainer;
