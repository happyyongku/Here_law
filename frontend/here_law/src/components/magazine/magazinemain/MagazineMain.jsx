import { useNavigate } from "react-router-dom";
import MagazineMainHeaderCard from "./MagazineMainHeaderCard";
import MagazineMainCateCard from "./MagazineMainCateCard";
import MagazineHotfix from "../magazinehotfix/MagazineHotfix";
import MagazineMainCustomCard from "./MagazineMainCustomCard";
import axiosInstance from "../../../utils/axiosInstance";
import "./MagazineMain.css";

// 임시 이미지 imoprt
import prom1 from "../../../assets/magazine/prom1.png";
import prom2 from "../../../assets/magazine/prom2.png";
import { useEffect } from "react";

function MagazineMain() {
  // 기사 유형별 axios 요청이 필요하다
  // 한번에 받는걸로 정함
  // 1. 맞춤형
  // 2. 패치노트
  // 3. 인기순
  // 4. 분야별

  const navigate = useNavigate();

  // 여기서 axios로 의안 정보 호출
  const getBillData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        "/fastapi_ec2/bill/bills"
        //   {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
      console.log("의안 조회 성공", response.data);
      // setUserData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 여기서 axios로 매거진 포스팅 정보 호출
  const getMagazineData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/fastapi_ec2/magazine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("포스팅 조회 성공", response.data);
      // setUserData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getBillData();
    getMagazineData();
  }, []);

  const interests = [
    "가족법",
    "형사법",
    "민사법",
    "부동산 및 건설",
    "회사 및 상사법",
    "국제 및 무역법",
    "노동 및 고용법",
    "조세 및 관세법",
    "지적재산권",
    "의료 및 보험법",
    "행정 및 공공법",
  ];

  return (
    <div className="magazine-main">
      <div className="magazine-main-header">
        <div className="magazine-main-header1">
          <img className="magazine-main-header1-img1" src={prom1} alt="" />
          <img className="magazine-main-header1-img2" src={prom2} alt="" />
          <h3 className="magazine-main-header1-title">
            TOP 추천 기사 관심 <br /> 분야 <br /> 조회수 기반
          </h3>
          <div className="magazine-main-header1-article-box">
            <div className="magazine-main-header1-article-content">
              소상공인을 위한 법이 계정되었다. 관련 법에 대한 타협점이 필요로
              하다.
            </div>
            <button className="magazine-main-detail-button">자세히 보기</button>
          </div>
        </div>
        <div className="magazine-main-header2">
          <MagazineMainHeaderCard
            cardTitle={"법제처 긴급 hot fix"}
            navigateButton={() => navigate("hotfix")}
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
          {interests.map((item, index) => (
            <MagazineMainCateCard key={index} item={item} />
          ))}
        </div>
      </div>
      <div className="magazine-main-posting-fetch-container">
        <div className="magazine-main-posting-fetch-title">
          사용자 선택 TOP AI 포스팅/패치노트
        </div>
        <div className="magazine-main-posting-fetch-body">
          <div className="magazine-main-posting-box"></div>
          <div className="magazine-main-fetch-box">
            <div>패치노트 바로 가기</div>
            <img src="" alt="" />
          </div>
        </div>
      </div>
      <div className="magazine-main-custom-posting">
        <div className="magazine-main-custom-title">
          유저 맞춤형 TOP AI 포스팅
        </div>
        {/* 여기에 기사 카드가 반복문으로 들어가야 한다 */}
        {/* 요청으로 받아오고 반복 돌려야 한다 */}
        {/* {aiPosting.map((item, index) => (
            <></>
        ))} */}
        <div></div>
      </div>
    </div>
  );
}

export default MagazineMain;
