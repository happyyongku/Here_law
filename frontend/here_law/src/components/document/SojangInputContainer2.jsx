import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SojangInputContainer2.css";
import LightIcon from "../../assets/search/light.gif";
import SojangIcon from "../../assets/document/sojang.png";

import axiosInstance from "../../utils/axiosInstance";

import Loader from "../search/caselist/Loader";

function SojangInputContainer2() {
  const navigate = useNavigate();

  const [isTipVisible, setIsTipVisible] = useState(false); // 제목 TIP 표시
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const [caseTitle, setCaseTitle] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [address, setAddress] = useState("");
  const [plaintiffPhone, setPlaintiffPhone] = useState("");
  const [defendant, setDefendant] = useState("");
  const [address2, setAddress2] = useState("");
  const [defendantPhone, setDefendantPhone] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseDetails, setCaseDetails] = useState("");

  const [plaintiffSubAddress, setPlaintiffSubAddress] = useState("");
  const [defendantSubAddress, setDefendantSubAddress] = useState("");

  const handleAddressSearch = () => {
    // 카카오 주소 검색 API 호출
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색한 주소 데이터를 state에 저장
        setAddress(data.address);
      },
    }).open();
  };
  const handleAddressSearch2 = () => {
    // 카카오 주소 검색 API 호출
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색한 주소 데이터를 state에 저장
        setAddress2(data.address); // address 필드를 사용하여 address2 업데이트
      },
    }).open();
  };

  const handleFocus = () => {
    setIsTipVisible(true); // input 클릭 시 TIP 표시
  };

  //   const handleBlur = () => {
  //     setIsTipVisible(false); // input focus 해제 시 TIP 숨기기
  //   };

  const handleSubmit = async () => {
    // 입력 값 검증
    if (!caseTitle) {
      alert("사건 제목을 입력해주세요.");
      return;
    }
    if (!plaintiff) {
      alert("원고를 입력해주세요.");
      return;
    }
    if (!address) {
      alert("원고 주소를 입력해주세요.");
      return;
    }
    if (!plaintiffPhone) {
      alert("원고 전화번호를 입력해주세요.");
      return;
    }
    if (!defendant) {
      alert("피고를 입력해주세요.");
      return;
    }
    if (!address2) {
      alert("피고 주소를 입력해주세요.");
      return;
    }
    if (!defendantPhone) {
      alert("피고 전화번호를 입력해주세요.");
      return;
    }
    if (!courtName) {
      alert("법원명을 입력해주세요.");
      return;
    }
    if (!caseDetails) {
      alert("사건 내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        case_title: caseTitle,
        plaintiff: plaintiff,
        plaintiff_address: `${address} ${plaintiffSubAddress}`,
        plaintiff_phone: plaintiffPhone,
        defendant: defendant,
        defendant_address: `${address2} ${defendantSubAddress}`,
        defendant_phone: defendantPhone,
        court_name: courtName,
        case_details: caseDetails,
      };

      const response = await axiosInstance.post(
        "/fastapi_ec2/sojang/generate",
        requestBody
      );

      if (response.status === 200) {
        console.log("소장 생성 성공");
        const { pdf_url, docx_url } = response.data;

        // pdf_url에서 파일 이름 추출
        const pdfFilename = pdf_url.split("/").pop();

        console.log(pdfFilename);

        // GET 요청으로 PDF 미리보기 데이터 가져오기
        const previewResponse = await axiosInstance.get(
          `/fastapi_ec2/sojang/preview/${pdfFilename}`
        );

        console.log(previewResponse);
        console.log(previewResponse.request.responseURL);

        navigate("/sojang/result", {
          state: {
            pdfUrl: pdf_url,
            previewPdfUrl: previewResponse.request.responseURL,
            docxUrl: docx_url,
            // previewData: previewResponse.data,
          },
        });
      }
    } catch (error) {
      console.error("소장 생성 실패:", error);
      alert("소장 생성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sojang-input-container">
      <div className="sojang-header">
        <div className="tip-box">Tip</div>
        <div>아래 내용을 입력하면 소장이 양식에 맞게 생성됩니다.</div>
      </div>

      <div className="sojang-page2">
        <div class="progressbar-wrapper">
          <div class="progressbar">
            <div class="active">Step 1</div>
            <div>Step 2</div>
          </div>
        </div>

        <div className="sojang-title-title">
          <div>소장 작성</div>
          <img src={SojangIcon} alt="sojang-icon" className="sojang-icon" />
        </div>
        <div className="sojang-title-box">
          <div>사건 제목</div>
          <input
            type="text"
            placeholder="사건 제목을 입력해주세요"
            className="sojang-title-box-input"
            value={caseTitle}
            onChange={(e) => setCaseTitle(e.target.value)}
            onFocus={handleFocus}
            // onBlur={handleBlur}
          />
        </div>
        {/* TIP 부분이 input 클릭 시에만 표시 */}
        {isTipVisible && (
          <div className="sojang-tip">
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              <img
                src={LightIcon}
                alt="light-icon"
                className="sojang-light-icon"
              />
              작성 TIP
            </div>
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              사건 제목 한 개를 구체적으로 작성해주세요. ex) 사기 혐의에 대한
              손해배상 청구 소송
            </div>
          </div>
        )}
        {isLoading && <Loader />}
        <div className="sojang-wongo-box">
          <div>
            원고
            <span
              style={{ fontSize: "13px", color: "#8C8C8C", fontWeight: "500" }}
            >
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> *</span>{" "}
              소송을 제기하여 재판을 청구한 사람.
            </span>
          </div>
          <input
            type="text"
            placeholder="원고를 입력하세요"
            className="sojang-wongo-input"
            value={plaintiff}
            onChange={(e) => setPlaintiff(e.target.value)}
          />
        </div>
        <div className="sojang-address-box2">
          <div>원고 주소</div>
          <div className="sojang-main-address-box2">
            <input
              className="sojang-main-address2"
              type="text"
              value={address}
              readOnly
            />
            <button
              className="sojang-address-button2"
              onClick={handleAddressSearch}
            >
              주소 검색 🔍︎
            </button>
          </div>
          <input
            className="sojang-sub-address2"
            type="text"
            placeholder="원고의 상세 주소를 입력하세요"
            value={plaintiffSubAddress}
            onChange={(e) => setPlaintiffSubAddress(e.target.value)}
          />
        </div>
        <div className="sojang-number-box">
          <div>원고 전화번호</div>
          <input
            type="text"
            placeholder="000-0000-0000"
            className="sojang-number-box-input"
            value={plaintiffPhone}
            onChange={(e) => setPlaintiffPhone(e.target.value)}
          />
        </div>
        {/* 피고 */}
        <div className="sojang-wongo-box">
          <div>
            피고
            <span
              style={{ fontSize: "13px", color: "#8C8C8C", fontWeight: "500" }}
            >
              <span style={{ color: "#FF5E00", fontWeight: "bold" }}> *</span>{" "}
              원고에 의해 고소 또는 청구를 당한 사람
            </span>
          </div>
          <input
            type="text"
            placeholder="피고를 입력하세요"
            className="sojang-wongo-input"
            value={defendant}
            onChange={(e) => setDefendant(e.target.value)}
          />
        </div>
        <div className="sojang-address-box2">
          <div>피고 주소</div>
          <div className="sojang-main-address-box2">
            <input
              className="sojang-main-address2"
              type="text"
              value={address2}
              readOnly
            />
            <button
              className="sojang-address-button2"
              onClick={handleAddressSearch2}
            >
              주소 검색 🔍︎
            </button>
          </div>
          <input
            className="sojang-sub-address2"
            type="text"
            placeholder="피고의 상세 주소를 입력하세요"
            value={defendantSubAddress}
            onChange={(e) => setDefendantSubAddress(e.target.value)}
          />
        </div>
        <div className="sojang-number-box">
          <div>피고 전화번호</div>
          <input
            type="text"
            placeholder="000-0000-0000"
            className="sojang-number-box-input"
            value={defendantPhone}
            onChange={(e) => setDefendantPhone(e.target.value)}
          />
        </div>
        <div className="sojang-number-box">
          <div>법원명</div>
          <input
            type="text"
            placeholder="법원명을 입력하세요. ex) 서울남부지방법원"
            className="sojang-number-box-input"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
          />
        </div>
        <div className="sojang-content-box">
          <div>사건 내용</div>
          <textarea
            placeholder="사건 내용을 시간 순서에 따라 구체적으로 작성해주세요."
            className="sojang-content-box-input"
            value={caseDetails}
            onChange={(e) => setCaseDetails(e.target.value)}
          />
        </div>
      </div>
      <button className="sojang-submit-button" onClick={handleSubmit}>
        작성
      </button>
    </div>
  );
}

export default SojangInputContainer2;
