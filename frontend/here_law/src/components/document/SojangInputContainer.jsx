import React, { useState } from "react";
import RentHeader from "./RentHeader";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../search/caselist/Loader";
import "./SojangInputContainer.css";

import SojangIcon from "../../assets/document/sojang.png";
import LightIcon from "../../assets/search/light.gif";

function SojangInputContainer() {
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태 관리
  const [isTipVisible, setIsTipVisible] = useState(false); // TIP 표시 상태 관리
  const [formData, setFormData] = useState({
    case_title: "",
    plaintiff: "",
    plaintiff_address: "",
    plaintiff_phone: "",
    defendant: "",
    defendant_address: "",
    defendant_phone: "",
    court_name: "",
    case_details: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    // 여기에 axios로 데이터 전송 로직 추가
    axiosInstance
      .post("/your-api-endpoint", formData)
      .then((response) => {
        setIsUploading(false);
        // 성공 처리 로직
      })
      .catch((error) => {
        setIsUploading(false);
        // 에러 처리 로직
      });
  };

  const handleFocus = () => {
    setIsTipVisible(true); // input 클릭 시 TIP 표시
  };

  const handleBlur = () => {
    setIsTipVisible(false); // input focus 해제 시 TIP 숨기기
  };

  return (
    <div>
      <div className="sojang-top">
        <div className="tip-box">Tip</div>
        아래 내용을 입력하면 소장이 양식에 맞게 생성됩니다.{" "}
      </div>
      <div className="sojang-wrap">
        <div className="sojang-page">
          <div className="sojang-title-text">
            소장 작성{" "}
            <img src={SojangIcon} alt="sojang-icon" className="sojang-icon" />
          </div>

          <div className="sojang-input-title">
            사건 제목{" "}
            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              ({" "}
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> * </span>{" "}
              10자 이상 )
            </span>
          </div>
          <div className="sojang-input-wrap">
            <input
              type="text"
              placeholder="사건 제목을 입력해주세요"
              onFocus={handleFocus} // input focus 시 이벤트
              onBlur={handleBlur} // input focus 해제 시 이벤트
            />
          </div>

          {/* TIP 부분이 input 클릭 시에만 표시 */}
          {isTipVisible && (
            <div className="sojang-tip">
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                {" "}
                <img
                  src={LightIcon}
                  alt="light-icon"
                  className="sojang-light-icon"
                />
                작성 TIP
              </div>
              <div style={{ fontSize: "14px", marginTop: "4px" }}>
                1개의 질문을 구체적으로 작성해주세요. ex) 사기죄로 고소를
                당했습니다. 어떻게 해야하나요?
              </div>
            </div>
          )}

          <div className="sojang-input-title">
            원고
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginLeft: "6px",
                color: "#8C8C8C",
              }}
            >
              {" "}
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> * </span>
              소송을 제기하여 재판을 청구한 사람.
            </span>
          </div>
          <div className="sojang-input-wrap">
            <input type="text" placeholder="원고를 입력해주세요" />
          </div>

          <div className="sojang-input-title">원고 주소</div>
          <div className="sojang-input-box">
            <div className="sojang-input-address-wrap">
              <input type="text" placeholder="주소를 입력해주세요" />
            </div>
            <button className="sojang-address-button">주소 찾기 🔍︎</button>
          </div>

          <div className="sojang-input-wrap">
            <input type="text" placeholder="상세 주소를 입력해주세요" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SojangInputContainer;
