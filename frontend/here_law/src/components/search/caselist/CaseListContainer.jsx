import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// 리덕스로 불러오기
import { useDispatch, useSelector } from "react-redux";
import { loadCases } from "../../../redux/actions/caseActions";

// axios로 불러오기
import axiosInstance from "../../../utils/axiosInstance";

import SortIcon from "../../../assets/search/sorticon.png";
import SortIcon2 from "../../../assets/search/sorticon2.png";
import CaseHeader from "./CaseHeader";
import CaseItem from "./CaseItem";
import Page from "./Page";
import "./CaseListContainer.css";

const CaseListContainer = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || ""; // 쿼리 파라미터 읽기

  // console.log(query);

  const page = Number(searchParams.get("page")) || 1; // 페이지 파라미터 읽기

  // console.log(page);

  // 리덕스
  // const dispatch = useDispatch(); // 액션 디스패치 함수
  // const caseData = useSelector((state) => state.cases); // 리덕스 스토어에서 가져오기

  // console.log(caseData);
  // console.log("1번 강경민");

  // // page가 변경될 때마다 데이터 요청
  // useEffect(() => {
  //   dispatch(loadCases(query, page));
  // }, [query, page, dispatch]);

  // console.log(caseData);
  // console.log("2번 강경민");

  const [caseData, setCaseData] = useState({
    cases: [],
    totalResults: 0,
    totalPages: 0,
  });

  // 판례 상세 조회 axios 요청
  const CaseSearchRequest = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
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

      <div className="case-list-page">
        <div className="case-list-top">
          전문 판례{" "}
          <span style={{ fontWeight: "bold" }}>{caseData.totalResults}개</span>
          가 검색되었습니다.
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
            {/* 추가 사건 종류 */}
          </div>
        )}

        {/* 판례 리스트 */}
        {caseData.cases.length > 0 ? (
          caseData.cases.map((caseItem) => (
            <CaseItem key={caseItem.caseInfoId} caseItem={caseItem} />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}

        <Page query={query} page={page} totalPages={caseData.totalPages} />
      </div>
    </div>
  );
};

export default CaseListContainer;
