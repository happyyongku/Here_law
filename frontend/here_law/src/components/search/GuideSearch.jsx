import { useEffect } from "react";
import "./GuideSearch.css";

function GuideSearch() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".guide-title, .guide-subtitle, .guide-result, .guide-image, .guide-result-document, .guide-result-magazine"
      );
      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight * 0.8) {
          element.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="search-guide-box">
      <div className="guide-wrap">
        <div className="guide-title">더 빠르고 정확한 검색</div>
        <div className="guide-subtitle">
          여기로를 통해서 더 빠르고 정확하게 판례를 검색해 보세요.
        </div>
      </div>

      <div className="guide-image">문장으로 검색하기 gif 또는 이미지</div>

      <div className="guide-result-box">
        <div className="guide-result">결과1</div>
        <div className="guide-result">결과2</div>
        <div className="guide-result">결과3</div>
      </div>
    </div>
  );
}

export default GuideSearch;
