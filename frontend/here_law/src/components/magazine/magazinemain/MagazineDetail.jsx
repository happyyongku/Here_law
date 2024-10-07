import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "./MagazineDetail.css";

// 임시 사진
import image from "../../../assets/magazine/image.png";
import { useEffect, useState } from "react";

function MagazineDetail() {
  const params = useParams();
  console.log(params.id);
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

  useEffect(() => {
    getMagazineDetailData();
  }, []);

  //   포스팅 추천하기 axios 요청

  // if (!postingDetail.title) {
  //   return <div></div>;
  // }

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
      <button className="magazine-detail-like-button">개추 button</button>
    </div>
  );
}

export default MagazineDetail;
