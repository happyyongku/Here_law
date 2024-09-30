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
  console.log("쿼리읽기");
  console.log(query);
  const page = Number(searchParams.get("page")) || 1; // 페이지 파라미터 읽기
  // ... 생략 ...
  // 리덕스
  const dispatch = useDispatch(); // 액션 디스패치 함수
  const caseData = useSelector((state) => state.cases); // 리덕스 스토어에서 가져오기

  console.log(caseData);
  console.log("1번 강경민");

  // page가 변경될 때마다 데이터 요청
  useEffect(() => {
    dispatch(loadCases(query, page));
  }, [query, page, dispatch]);

  console.log(caseData);
  console.log("2번 강경민");

  // axios
  // const [cases, setCases] = useState([]); // 판례 데이터를 상태로 관리
  // const [totalResults, setTotalResults] = useState(0); // 총 검색 결과 수
  // const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  // const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  // const [loading, setLoading] = useState(false); // 로딩 상태
  // const [error, setError] = useState(null); // 에러 상태
  // const size = searchParams.get("size") || 10; // 한 페이지에 표시할 판례 수

  // useEffect(() => {
  //   const fetchCases = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       // API 호출
  //       const response = await axiosInstance.get("/spring_api/cases/search", {
  //         params: {
  //           query,
  //           page,
  //           size,
  //         },
  //       });
  //       const data = response.data;

  //       // 상태 업데이트
  //       setCases(data.cases);
  //       setTotalResults(data.totalResults);
  //       setCurrentPage(data.currentPage);
  //       setTotalPages(data.totalPages);
  //     } catch (err) {
  //       console.error("API 요청 실패:", err); // API 호출 실패 시 오류 출력
  //       setError("검색 결과를 가져오는 중 오류가 발생했습니다.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCases();
  // }, [query, page, size]); // 검색어, 페이지 번호, 사이즈가 변경될 때마다 호출

  // // 로딩 상태 표시
  // if (loading) return <p>로딩 중...</p>;

  // // 에러 상태 표시
  // if (error) return <p>{error}</p>;

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

  console.log(query);
  console.log("쿼맄");

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

        {/* 이하 판례 리스트 */}
        {caseData.cases.map((caseItem) => (
          <CaseItem
            key={caseItem.id}
            id={caseItem.id}
            title={caseItem.title}
            summary={caseItem.summary}
            date={caseItem.date}
            result={caseItem.result}
            relatedLaws={caseItem.relatedLaws}
          />
        ))}

        <Page query={query} page={page} totalPages={caseData.totalPages} />
      </div>
    </div>
  );
};

export default CaseListContainer;
