import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./LawyerDetail.css";

function LawyerDetail({ isOpen, onClose, lawyerId }) {
  console.log("dddddddddd");
  console.log(lawyerId);
  console.log("dddddddddd");
  const [lawyerDetail, setLawyerDetail] = useState({});
  const getLawyerRec = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/lawyer/lawyer/${lawyerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("변호사 상세 조회 성공", response.data);
      setLawyerDetail(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 변호사 상세 조회 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getLawyerRec();
  }, [lawyerId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <button className="modal-close2" onClick={onClose}>
          닫기
        </button>
        <div>이미지 대용</div>
        <div>
          <div>변호사명</div>
          <div>{lawyerDetail.nickname}</div>
        </div>
        <div>
          <div>전문분야</div>
          <div>{lawyerDetail.expertise_main}</div>
        </div>
        <div>
          <div>이메일</div>
          <div>{lawyerDetail.email}</div>
        </div>
        <div>
          <div>소개글</div>
          <div>{lawyerDetail.description}</div>
        </div>
        <div>
          <div>변호사 전화번호</div>
          <div>{lawyerDetail.user_phone}</div>
        </div>
        <div>
          <div>
            <div>위치</div>
            <div>{lawyerDetail.office_location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LawyerDetail;
