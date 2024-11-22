import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../../utils/axiosInstance";

import SortIcon from "../../../assets/search/sorticon.png";
import SortIcon2 from "../../../assets/search/sorticon2.png";
import CaseHeader from "./CaseHeader";
import CaseItem from "./CaseItem";
import Page from "./Page";
import "./CaseListContainer.css";

import Loader from "./Loader";

const CaseListContainer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || ""; // 쿼리(keyword)
  // console.log(query);
  const page = Number(searchParams.get("page")) || 1; // 페이지
  // console.log(page);

  const [caseData, setCaseData] = useState({
    cases: [],
    totalResults: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 판례 상세 조회 axios 요청
  const CaseSearchRequest = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true); // 로딩 시작
    try {
      const response = await axiosInstance.get(`/spring_api/cases/search`, {
        params: {
          keyword: query,
          page: page,
          size: 10,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("판례검색 성공", response.data);
      setCaseData(response.data);
    } catch (error) {
      console.log("판례검색 실패", error);
    }
    setIsLoading(false); // 로딩 종료
  };

  useEffect(() => {
    CaseSearchRequest();
  }, [query, page]);

  // 사건 종류
  const caseTypes = ["형사 사건", "민사 사건", "행정 사건"]; // 임시 데이터
  const [isCaseTypeVisible, setCaseTypeVisible] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState("사건 종류"); // 기본 텍스트

  // 사건 종류 클릭
  const toggleCaseType = () => {
    setCaseTypeVisible(!isCaseTypeVisible); // 현재 상태를 반전
  };

  const handleCaseTypeClick = (type) => {
    setSelectedCaseType(type); // 클릭한 사건 종류 설정
    setCaseTypeVisible(false); // 목록 닫기
  };

  return (
    <div className="case-list-container">
      <CaseHeader query={query} />

      {/* 로딩 중일 때 로딩 컴포넌트 표시 */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="case-list-page">
            <div className="case-list-top">
              {/* 검색 결과가 있을 때만 표시 */}
              {caseData.totalResults > 0 && (
                <>
                  전문 판례{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {caseData.totalResults}개
                  </span>
                  가 검색되었습니다.
                </>
              )}

              <div
                className={`case-list-sort ${
                  selectedCaseType !== "사건 종류" ? "selected" : ""
                }`}
                onClick={toggleCaseType}
              >
                {selectedCaseType}
                <img
                  src={selectedCaseType !== "사건 종류" ? SortIcon2 : SortIcon}
                  alt="sort icon"
                  className="sort-icon"
                />
              </div>
            </div>

            {/* 사건 종류 리스트 토글 */}
            {isCaseTypeVisible && (
              <div className="case-type-list">
                {caseTypes.map((type) => (
                  <div key={type} onClick={() => handleCaseTypeClick(type)}>
                    {type}
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과가 없을 때 메시지 표시 */}
            {
              caseData.cases.length > 0
                ? caseData.cases.map((caseItem) => (
                    <CaseItem key={caseItem.caseInfoId} caseItem={caseItem} />
                  ))
                : query && (
                    <p>검색 결과가 없습니다.</p>
                  ) /* 검색 쿼리가 있을 때만 결과 없음 표시 */
            }

            <Page query={query} page={page} totalPages={caseData.totalPages} />
          </div>
        </>
      )}
    </div>
  );
};

export default CaseListContainer;
