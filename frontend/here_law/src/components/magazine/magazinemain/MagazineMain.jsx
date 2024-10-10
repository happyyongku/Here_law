import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MagazineMainHeaderCard from "./MagazineMainHeaderCard";
import MagazineMainCateCard from "./MagazineMainCateCard";
import MagazineHotfix from "../magazinehotfix/MagazineHotfix";
import MagazineMainCustomCard from "./MagazineMainCustomCard";
import axiosInstance from "../../../utils/axiosInstance";
import fastaxiosInstance from "../../../utils/fastaxiosInstance";
import MagazineCustomCard from "./MagazineCustomCard";
import ViewCard from "./ViewCard";
import "./MagazineMain.css";

// 임시 이미지 imoprt
import prom1 from "../../../assets/magazine/prom1.png";
import prom2 from "../../../assets/magazine/prom2.png";
import fetchButton from "../../../assets/magazine/fetchButton.png";

import mainimg from "../../../assets/magazine/mainimg.png";
import dbtmxlxldk from "../../../assets/magazine/dbtmxlxldk.png";
import usti from "../../../assets/magazine/usti.png";
import file from "../../../assets/magazine/file.png";

import fetchimg from "../../../assets/magazine/fetchimg.png";
// import fetchimg2 from "../../../assets/magazine/usermag.png";
import fetchimg2 from "../../../assets/magazine/다운로드.jfif";

import Noteimg from "../../../assets/magazine/note1.png";

function MagazineMain() {
  const navigate = useNavigate();

  const [myPosting, setMyPosting] = useState([]);
  const [viewPosting, setViewPosting] = useState([]);
  const [recPosting, setRecPosting] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [firstRecPosting, setFirstRecPosting] = useState("");

  // 1. 여기서 axios로 유저 맞춤형 매거진 포스팅 정보 호출 (interest, subsciption)
  const getMagazineData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/fastapi_ec2/magazine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("맞춤형 포스팅 조회 성공", response.data);
      setMyPosting(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error(
          "Error fetching user data, 맞춤형 포스팅 조회 실패",
          error
        );
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 2. axios 조회순 포스팅
  const getMagazineViewData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        "/fastapi_ec2/magazine/top-viewed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("조회순 포스팅 조회 성공", response.data);
      setViewPosting(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error(
          "Error fetching user data, 조회순 포스팅 조회 실패",
          error
        );
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 3. axios 추천순 포스팅
  const getMagazineLikeData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        "/fastapi_ec2/magazine/top-liked",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("추천순 포스팅 조회 성공", response.data);
      setRecPosting(response.data);
      setFirstRecPosting(response.data[0]);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error(
          "Error fetching user data, 추천순 포스팅 조회 실패",
          error
        );
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getMagazineData();
    getMagazineViewData();
    getMagazineLikeData();
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
          {/* <img className="magazine-main-header1-img1" src={prom1} alt="" /> */}
          <img className="magazine-main-header1-img2" src={file} alt="" />
          <div className="magazine-main-title-background">
            <h3 className="magazine-main-header1-title">
              TOP 추천 기사 관심 <br /> 분야 <br /> 추천수 기반
            </h3>
          </div>
          <div className="magazine-main-header1-article-box">
            <div className="magazine-main-header1-article-content">
              {firstRecPosting.content}
            </div>
            <button
              className="magazine-main-detail-button"
              onClick={() => navigate(`${firstRecPosting.magazine_id}`)}
            >
              자세히 보기
            </button>
          </div>
        </div>
        <div className="magazine-main-header2">
          <MagazineMainHeaderCard
            cardTitle={"법제처 hot fix"}
            fetchimg={fetchimg}
            navigateButton={() => navigate("hotfix")}
          />
          <MagazineMainHeaderCard
            cardTitle={"유저 기반 추천"}
            fetchimg={fetchimg2}
            navigateButton={() => navigate("my")}
          />
        </div>
      </div>
      <div className="magazine-main-cate-container">
        <div className="magazine-main-cate-title">분야 선택하기</div>
        <div className="magazine-main-cate-contents">
          {interests.map((item, index) => (
            <MagazineMainCateCard key={index} item={item} index={index} /> // index 전달
          ))}
        </div>
      </div>
      <div className="magazine-main-posting-fetch-container">
        <div className="magazine-main-posting-fetch-title">
          사용자 선택 TOP AI 포스팅/패치노트
        </div>
        <div className="magazine-main-posting-fetch-body">
          <div className="magazine-main-posting-box">
            {viewPosting.slice(0, 4).map((posting, index) => (
              <ViewCard key={index} posting={posting} index={index} />
            ))}
          </div>
          <div className="magazine-main-fetch-box">
            <div className="fetch-title">패치노트 바로 가기</div>
            <img
              src={fetchButton}
              alt="fetchbutton"
              className="magazine-main-fetch-button"
              onClick={() => navigate("hotfix")}
            />
          </div>
        </div>
      </div>
      <div className="magazine-main-custom-posting">
        <div className="magazine-main-custom-title">
          유저 맞춤형 TOP AI 포스팅
        </div>
        <div className="magazine-main-custom-posting-content">
          {myPosting.slice(0, 5).map((item, index) => (
            <MagazineCustomCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MagazineMain;
