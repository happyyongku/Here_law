import React, { useState } from "react";
import RentHeader from "./RentHeader";

import UploadIcon from "../../assets/document/uploadicon.png";
import CloseIcon from "../../assets/document/closeicon.png";

import "./DocumentUploadContainer.css";

function RentUpload() {
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 저장

  // 파일 선택 시 처리 함수
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  // 파일 삭제 함수
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // 업로드 버튼 클릭 시 파일 탐색기 열기
  const handleUploadClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div>
      <RentHeader />
      <div className="document-guide-page">
        <div className="document-guide-top">
          <div className="document-guide-title">등기부등본 업로드</div>
          <div className="document-guide-subtitle">
            PDF 파일을 업로드해 주세요.
          </div>
          <div className="document-input-wrap">
            {/* 선택된 파일이 있을 때만 파일명과 닫기 버튼 표시 */}
            <div className="document-input-box">
              {selectedFile ? (
                <>
                  <span>{selectedFile.name}</span> {/* 파일명 표시 */}
                  <img
                    src={CloseIcon}
                    alt="close-icon"
                    className="document-close-icon"
                    onClick={handleRemoveFile} // 파일 삭제
                  />
                </>
              ) : (
                <span>파일이 없습니다.</span> /* 파일 없을 때 기본 메시지 */
              )}
            </div>

            {/* 업로드 버튼 */}
            <div className="document-upload" onClick={handleUploadClick}>
              업로드
              <img
                src={UploadIcon}
                alt="upload-icon"
                className="document-upload-icon"
              />
            </div>

            {/* 실제 파일 선택 input (숨김 처리) */}
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }} // input 숨기기
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="document-next-button">위험도 분석</div>
      </div>
    </div>
  );
}

export default RentUpload;
