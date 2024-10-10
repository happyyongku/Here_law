import MagazineHotfixCard from "./MagazineHotfixCard";
import axiosInstance from "../../../utils/axiosInstance";
import "./MagazineHotfix.css";
import { useEffect, useState } from "react";

function MagazineHotfix() {
  // 변호사 추천 axios
  const [hotfixData, setHotfixData] = useState([]);
  const getLawyerRec = async () => {
    const token = localStorage.getItem("token");
    const formData = {
      date: "2024-10-10",
      span: 7,
    };
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/revision/law-revision`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: formData,
        }
      );
      console.log("패치노트 조회 성공", response.data);
      setHotfixData(Object.entries(response.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 패치노트 조회 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getLawyerRec();
  }, []);

  return (
    <div className="magazine-hotfix-container">
      <div className="magazine-hotfix-title">
        <div className="hotfix-text">패치노트 :</div>
        <div className="hotfix-text">법률 개정사항</div>
      </div>
      <div className="magazine-hotfix-content">
        {hotfixData.map((item, index) => (
          <MagazineHotfixCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default MagazineHotfix;
