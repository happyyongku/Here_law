import { useEffect } from "react";
import "./GuideSearch.css";
import KeyWordGif from "../../assets/search/keywordgif.gif";
import Guide3 from "../../assets/search/guide3.png";
import Guide4 from "../../assets/search/guide4.png";

function GuideSearch() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".guide-title, .guide-subtitle,.guide-result-document2, .guide-result, .guide-sojang-image, .guide-image, .guide-result-document, .guide-result-magazine,  .guide-result-magazine2"
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
        <div className="guide-title">
          더 빠르고{" "}
          <span style={{ fontWeight: "bold", color: "#f55e00" }}>정확한</span>{" "}
          검색
        </div>
        <div className="guide-subtitle">
          여기로를 통해서 더 빠르고 정확하게 판례를 검색해 보세요.
        </div>
      </div>

      <div className="guide-image">
        <div>문장</div>
      </div>

      {/* <div className="guide-result-box">
        <div className="guide-result">
          <img src={Guide3} alt="" className="guide-result" />
        </div>
        <div className="guide-result">
          <img src={Guide4} alt="" className="guide-result" />
        </div>
      </div> */}
    </div>
  );
}

export default GuideSearch;
