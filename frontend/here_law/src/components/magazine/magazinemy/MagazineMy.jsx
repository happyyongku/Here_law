import { useEffect, useState } from "react";
import MyCard from "./MyCard";
import MySubCard from "./MySubCard";
import MyIntCard from "./MyIntCard";
import CaseLawyerRec from "../magazinemain/CaseLawyerRec";
import axiosInstance from "../../../utils/axiosInstance";
import LawyerDetail from "../magazinemain/LawyerDetail";
import "./MagazineMy.css";

function MagazineMy() {
  const [myPosting, setMyPosting] = useState([]);

  // 모달관련 코드 작성하는 곳
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lawyerId, setLawyerId] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  // 2. 유저 정보 요청 (구독, 관심분야 정보)
  const [userInterests, setUserInterest] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/spring_api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("회원정보 조회 성공", response.data);
      setUserInterest(response.data.interests);
      setUserSubscriptions(response.data.subscriptions);
      console.log(response.data.interest);
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

  // 변호사 추천 axios
  const [recedLawyer, setRecedLawyer] = useState([]);
  const getLawyerRec = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/lawyer/recommended-lawyers-cosine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("변호사 추천 조회 성공", response.data);
      setRecedLawyer(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 변호사 추천 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getMagazineData();
    getUserData();
    getLawyerRec();
  }, []);

  return (
    <div className="magazine-my-container">
      <div className="magazine-my-header">
        <div className="magazine-my-header-title-box">
          <div className="magazine-my-header-title">맞춤형 추천</div>
          <div className="magazine-my-header-desc">
            관심분야, 구독사항, 조회, 추천 기반으로 포스팅을 추천해줍니다.
            관심분야, 구독사항, 조회, 추천 기반으로 포스팅을 추천해줍니다.
            관심분야, 구독사항, 조회, 추천 기반으로 포스팅을 추천해줍니다.
          </div>
        </div>
        <div className="magazine-my-header-content-box">
          <div className="magazine-my-header-interest">
            <div className="magazine-my-interest-title">관심분야</div>
            <div className="magazine-my-interest-card-box">
              {userInterests.map((item, index) => (
                <MyIntCard key={index} item={item} />
              ))}
            </div>
          </div>
          <div className="magazine-my-header-subs">
            <div className="magazine-my-subs-title">구독</div>
            <div className="magazine-my-interest-card-box">
              {userSubscriptions.map((item, index) => (
                <MySubCard key={index} item={item} />
              ))}
            </div>
          </div>
          <div className="case-type-lawyer-rec">
            <div className="case-type-lawyer-rec-title">변호사 추천</div>
            <div>
              {/* 여기에 반복이 들어가야 한다. */}
              {recedLawyer.slice(0, 5).map((item, index) => (
                <CaseLawyerRec
                  key={index}
                  item={item}
                  onClick={openModal}
                  setLawyerId={setLawyerId}
                  index={index}
                />
              ))}
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="magazine-my-content">
        {myPosting.map((item, index) => (
          <MyCard key={index} item={item} index={index} />
        ))}
      </div>
      {/* <button onClick={openModal}></button> */}
      <LawyerDetail
        isOpen={isModalOpen}
        onClose={closeModal}
        lawyerId={lawyerId}
      />
    </div>
  );
}

export default MagazineMy;
