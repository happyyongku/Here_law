import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Page.css";

const Page = ({ query, page, totalPages, pageGroupSize = 7 }) => {
  const navigate = useNavigate();

  console.log(11);
  console.log("쿼리");
  console.log(query);
  console.log(22);

  // 페이지네이션 링크 생성 함수
  const generatePageLinks = () => {
    const pages = [];
    const totalPagesToShow = pageGroupSize; // 한 번에 보여줄 페이지의 수
    const lastPage = totalPages; // 마지막 페이지

    // 현재 페이지가 속한 범위 계산
    const startPage = Math.max(1, page - Math.floor(totalPagesToShow / 2));
    const endPage = Math.min(lastPage, startPage + totalPagesToShow - 1);

    // 첫 번째 페이지부터 마지막 페이지까지 생성
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          to={`/search/case?query=${query}&page=${i}`}
          className={i === Number(page) ? "active" : ""}
        >
          {i}
        </Link>
      );
    }

    // 맨 마지막 페이지를 추가 (50)
    if (endPage < lastPage) {
      pages.push(<span key="dots">... </span>); // 중간 생략 표시
      pages.push(
        <Link
          key={lastPage}
          to={`/search/case?query=${query}&page=${lastPage}`}
          className={page === Number(lastPage) ? "active" : ""}
        >
          {lastPage}
        </Link>
      );
    }

    return pages;
  };

  // 다음 페이지 그룹으로 이동하는 함수
  const handleNext = () => {
    const currentGroupEnd = Math.ceil(page / pageGroupSize) * pageGroupSize;
    const nextPageGroupStart = Math.min(currentGroupEnd + 1, totalPages);

    if (page < totalPages) {
      navigate(`/search/case?query=${query}&page=${nextPageGroupStart}`);
    }
  };

  // 이전 페이지 그룹으로 이동하는 함수
  const handlePrev = () => {
    const currentGroupStart =
      Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
    const prevPageGroupStart = Math.max(currentGroupStart - pageGroupSize, 1);

    if (page > 1) {
      navigate(`/search/case?q=${query}&page=${prevPageGroupStart}`);
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={page === 1}>
        &lt; 이전
      </button>
      {generatePageLinks()}
      <button onClick={handleNext} disabled={page === totalPages}>
        다음 &gt;
      </button>
    </div>
  );
};

export default Page;
