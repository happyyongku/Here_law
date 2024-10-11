import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CaseTypeCard from "./CaseTypeCard";
import axiosInstance from "../../../utils/axiosInstance";
import "./CaseType.css";
function CaseType() {
  const { type } = useParams();
  const [categoryData, setCategoryData] = useState([]);

  // 분야별 설명
  const descriptions = {
    가족법:
      "결혼, 이혼, 양육권, 상속 등 가족 간의 다양한 법적 문제에 대한 포스팅을 인공지능을 통해 제공합니다. 가족 구성원 간의 분쟁 해결과 법적 권리 보호를 위한 정보를 제공합니다.",
    형사법:
      "범죄 사건, 형사 재판 절차, 형사 처벌 등 다양한 형사법 관련 주제를 다룹니다. 형사 사건에서의 피고인 방어 전략 및 피해자 보호에 관한 정보를 인공지능을 통해 제공합니다.",
    민사법:
      "계약 분쟁, 재산권 분쟁, 채권·채무 관계, 손해배상 청구 등 다양한 민사 사건에 대한 포스팅을 인공지능을 통해 제공합니다. 개인 간의 법적 분쟁과 권리 보호를 위한 법적 조치를 설명합니다.",
    "부동산 및 건설":
      "부동산 거래, 임대차 분쟁, 건설 계약 등 다양한 부동산 및 건설 관련 사건을 다룹니다. 부동산 소유권, 건설 분쟁 해결 및 재개발 관련 법적 문제에 대한 정보를 제공합니다.",
    "회사 및 상사법":
      "회사 설립, 주식 발행, 기업 인수합병 등 다양한 회사 및 상사법 관련 주제를 다룹니다. 기업 경영과 관련된 법적 이슈 및 상거래 분쟁 해결에 관한 정보를 인공지능을 통해 제공합니다.",
    "국제 및 무역법":
      "국제 거래, 무역 분쟁, 해외 투자, 국제 중재 등 다양한 국제 및 무역법 관련 주제를 다룹니다. 글로벌 법적 분쟁 해결과 수출입 법규에 대한 정보를 제공합니다.",
    "노동 및 고용법":
      "노동자 권리 보호, 고용 계약, 해고 분쟁 등 다양한 노동 및 고용법 관련 주제를 다룹니다. 근로자와 고용주 간의 법적 관계 및 노동법 관련 이슈에 대한 정보를 제공합니다.",
    "조세 및 관세법":
      "세금 부과, 세무 조사, 관세 분쟁 등 다양한 조세 및 관세법 관련 주제를 다룹니다. 기업과 개인의 조세 문제, 절세 전략, 관세 규제에 대한 정보를 인공지능을 통해 제공합니다.",
    지적재산권:
      "저작권, 특허, 상표, 디자인 보호 등 다양한 지적재산권 관련 주제를 다룹니다. 지적 자산의 보호와 지적재산권 침해 시 법적 조치에 관한 정보를 제공합니다.",
    "의료 및 보험법":
      "의료 과실, 보험 청구, 의료 계약 등 다양한 의료 및 보험법 관련 주제를 다룹니다. 의료사고 책임 문제와 보험사와의 분쟁 해결 방법에 대한 정보를 인공지능을 통해 제공합니다.",
    "행정 및 공공법":
      "행정 처분, 공공기관 관련 분쟁, 행정심판 등 다양한 행정 및 공공법 관련 주제를 다룹니다. 정부와의 법적 분쟁 해결과 공공정책 이슈에 대한 정보를 제공합니다.",
  };

  // 1. 카테고리 데이터 axios 코드를 작성
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
    }
  };
  // 2. 구독 요청 axios
  const [forRand, setForRand] = useState(true);
  const subscriptionRequest = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        `/fastapi_ec2/magazine/subscribe/${type}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("카테고리 구독 성공", response.data.response);
      setForRand(!forRand);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 카테고리 구독 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 3. 구독 여부 axios 요청
  const [isSubscribed, setIsSubscribed] = useState(null);
  const getIsSubscribe = async () => {
    const token = localStorage.getItem("token");
    // console.log(type);
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/magazine/subscribe_check/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("카테고리 구독여부 조회 성공", response.data);
      setIsSubscribed(response.data.subscribe);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error(
          "Error fetching user data, 카테고리 구독여부 조회 실패",
          error
        );
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getMagazineLCateData();
    getIsSubscribe();
  }, [forRand]);

  return (
    <div className="case-type-container">
      <div className="case-type-title-box">
        <div className="case-type-title">{type}</div>
        <div className="case-type-content">
          {descriptions[type] || "해당 카테고리에 대한 설명이 없습니다."}
        </div>

        {!isSubscribed ? (
          <button
            className="case-subscribe-button"
            onClick={() => {
              subscriptionRequest();
            }}
          >
            구독하기
          </button>
        ) : (
          <button
            className="case-subscribe-button"
            onClick={() => {
              subscriptionRequest();
            }}
          >
            구독중
          </button>
        )}
      </div>
      <div className="case-type-content-box">
        {categoryData.map((item, index) => (
          <CaseTypeCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default CaseType;
