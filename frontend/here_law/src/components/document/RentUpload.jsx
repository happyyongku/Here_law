// import { useState } from "react";
import RentHeader from "./RentHeader";

import "./RentUpload.css";

function RentUpload() {
  return (
    <div>
      <RentHeader />
      <div className="document-guide-page">
        <div className="document-guide-top">
          <div className="document-guide-title">등기부등본 업로드</div>
          <div className="document-guide-subtitle">
            PDF 파일을 업로드해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentUpload;
