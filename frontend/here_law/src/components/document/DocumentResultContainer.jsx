import React, { useState } from "react";
import RentHeader from "./RentHeader";

import { useLocation } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

import UploadIcon from "../../assets/document/uploadicon.png";
import CloseIcon from "../../assets/document/closeicon.png";

import "./DocumentResultContainer.css";

function DocumentResultContainer() {
  const location = useLocation();
  const { analysis } = location.state || {}; // 전달된 state에서 analysis 추출

  return (
    <div>
      <RentHeader />
      <div className="document-guide-page">
        <div className="document-guide-top">
          <div className="document-guide-title">계약서 검사 결과 </div>
          <div className="document-guide-subtitle">
            JPG 파일을 업로드해 주세요.
          </div>
        </div>
        <div>{analysis}1</div>
      </div>
    </div>
  );
}

export default DocumentResultContainer;
