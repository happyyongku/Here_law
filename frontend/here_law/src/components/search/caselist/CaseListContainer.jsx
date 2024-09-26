import { useSearchParams } from "react-router-dom";

import CaseHeader from "./CaseHeader";
import "./CaseListContainer.css";

const CaseListContainer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // q=검색어
  const page = searchParams.get("page"); // page=페이지

  return (
    <div>
      <CaseHeader query={query} />

      <div className="case-list-page">
        <div>
          전문 판례 <span style={{ fontWeight: "bold" }}>19,443개</span>가
          검색되었습니다.
        </div>
        <h1>검색 결과 페이지</h1>
        <p>검색어: {query}</p>
        <p>페이지 번호: {page}</p>
        {/* 이하 검색 결과  */}
      </div>
    </div>
  );
};

export default CaseListContainer;
