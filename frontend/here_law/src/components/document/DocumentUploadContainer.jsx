import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RentHeader from "./RentHeader";
import axiosInstance from "../../utils/axiosInstance";

import UploadIcon from "../../assets/document/uploadicon.png";
import CloseIcon from "../../assets/document/closeicon.png";

import Loader from "../search/caselist/Loader";

import "./DocumentUploadContainer.css";

function DocumentUploadContainer() {
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 저장
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태 관리
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUploadClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("파일을 먼저 업로드해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);

      const response = await axiosInstance.post(
        "/fastapi_ec2/clause/analyze-clause",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // multipart/form-data 설정
            accept: "application/json", // JSON 응답
          },
        }
      );

      setIsUploading(false);
      const analysisResult = response.data.analysis;

      console.log(response);
      console.log(analysisResult);

      if (window.confirm("분석이 완료되었습니다. 결과를 확인하시겠습니까?")) {
        navigate("/document/result", { state: { analysis: analysisResult } });
      }
    } catch (error) {
      setIsUploading(false);
      console.error("업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  return (
    <div>
      <RentHeader />

      {isUploading && <Loader />}

      <div className="document-guide-page">
        <div className="document-guide-top">
          <div className="document-guide-title">계약서 업로드</div>
          <div className="document-guide-subtitle">
            JPG 또는 PDF 파일을 업로드해 주세요.
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
                <span>파일이 없습니다.</span>
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
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="document-next-button" onClick={handleAnalyze}>
          위험도 분석
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadContainer;
