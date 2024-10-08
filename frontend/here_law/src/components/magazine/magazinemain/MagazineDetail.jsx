import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "./MagazineDetail.css";

// 임시 사진
import image from "../../../assets/magazine/prom3.png";
import { useEffect, useState } from "react";

function MagazineDetail() {
  const params = useParams();

  // 포스팅 디테일 axios 요청
  const [postingDetail, setPostingDetail] = useState([]);
  const getMagazineDetailData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/magazine/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("포스팅 상세 조회 성공", response.data);
      setPostingDetail(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 상세 요청 실패입니다.", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 포스팅 추천하기 axios 요청
  const recRequest = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        `/fastapi_ec2/magazine/${params.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      console.log("추천하기 성공", response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 추천하기 실패입니다.", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getMagazineDetailData();
  }, []);

  return (
    <div className="magazine-detail-container">
      <div className="magazine-detail-header">
        <div className="magazine-detail-header-title">
          {postingDetail.title}
        </div>
        <div className="magazine-detail-header-date">
          {postingDetail.created_at}
        </div>
      </div>
      <img src={image} alt="" className="magazine-detail-img" />
      <div className="magazine-detail-content">{postingDetail.content}</div>
      <button
        className="magazine-detail-like-button"
        onClick={() => {
          recRequest();
        }}
      >
        개추 button
      </button>
    </div>
  );
}

export default MagazineDetail;
