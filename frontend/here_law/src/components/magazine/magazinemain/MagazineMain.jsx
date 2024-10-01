import { useNavigate } from "react-router-dom";
import MagazineMainHeaderCard from "./MagazineMainHeaderCard";

function MagazineMain() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="magazine-main-header">
        <div className="magazine-main-header1">
          <h3>TOP 추천 기사 관심 분야 조회수 기반</h3>
          <p>
            소상공인을 위한 법이 계정되었다. 관련 법에 대한 타협점이 필요로
            하다.
          </p>
          <button>자세히 보기</button>
        </div>
        <div className="magazine-main-header2">
          <MagazineMainHeaderCard
            cardTitle={"법제처 긴급 hot fix"}
            navigateButton={() => navigate("hotpost")}
          />
          <MagazineMainHeaderCard
            cardTitle={"유저 기반 추천"}
            navigateButton={() => navigate("hotfix")}
          />
        </div>
      </div>
      <div className="magazine-main-cate-container">
        <div className="magazine-main-cate-title">분야 선택하기</div>
        <div className="magazine-main-cate-contents">
          {/* 여기서 반복문 돌아야 한다 */}
          {/* 관심 항목별로 반복 돌아야 한다 */}
        </div>
      </div>
      <div className="magazine-main-posting-fetch-container">
        <div className="magazine-main-posting-fetch-title">
          사용자 선택 TOP AI 포스팅/패치노트
        </div>
        <div className="magazine-main-posting-box"></div>
        <div className="magazine-main-fetch-box"></div>
      </div>
      <div>
        <h3>유저 맞춤형 TOP AI 포스팅</h3>
        <div>{/* 여기에 기사 카드가 반복문으로 들어가야 한다 */}</div>
      </div>
    </div>
  );
}

export default MagazineMain;
