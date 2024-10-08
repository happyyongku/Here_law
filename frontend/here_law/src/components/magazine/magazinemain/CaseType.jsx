import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CaseTypeCard from "./CaseTypeCard";
import axiosInstance from "../../../utils/axiosInstance";
import "./CaseType.css";

function CaseType() {
  const { type } = useParams();

  const [categoryData, setCategoryData] = useState([]);

  // 카테고리 데이터 axios 코드를 작성
  const getMagazineLCateData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/magazine/category/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("카테고리 조회 성공", response.data);
      setCategoryData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 카테고리 조회 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 구독 요청 axios
  // const subscriptionRequest = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axiosInstance.get(
  //       `/fastapi_ec2/magazine/category/${type}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("카테고리 조회 성공", response.data);
  //     setCategoryData(response.data);
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       console.log("Token expired. Please log in again.");
  //       localStorage.removeItem("token");
  //     } else {
  //       console.error("Error fetching user data, 카테고리 조회 실패", error);
  //     }
  //   } finally {
  //     // setLoading(false);
  //     // 데이터 요청 후 로딩 상태 업데이트
  //   }
  // };

  useEffect(() => {
    getMagazineLCateData();
  }, []);

  const something = ["", "", ""];

  return (
    <div className="case-type-container">
      <div className="case-type-title-box">
        <div className="case-type-title">{type}</div>
        <div className="case-type-content">
          계약 분쟁, 재산권 분쟁, 채권 채무 관계, 손해배상 청구, 가족 법적 문제,
          부동산 관련 사건 등 다양한 민사 사건에 대한 포스팅을 인공지능을 통해서
          제공합니다.
        </div>
        <button className="case-subscribe-button">SUBSCRIBE</button>
      </div>
      <div className="case-type-content-box">
        {categoryData.map((item, index) => (
          <CaseTypeCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default CaseType;
