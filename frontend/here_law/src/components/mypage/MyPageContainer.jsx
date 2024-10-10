import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import UserInfo from "./UserInfo";
import LawyerLocation from "./LawyerLocation";
import Expertise from "./Expertise";
import Tel from "./Tel";
import Interest from "./Interest";
import Subscribe from "./Subscribe";
import LawyerInfo from "./LawyerInfo";
import ad from "../../assets/mypage/ad.png";
import "./MyPageContainer.css";
import axiosInstance from "../../utils/axiosInstance";

function MyPageContainer() {
  // 유저 데이터
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  // 여기서 axios로 user 정보 호출
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/spring_api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("회원정보 조회 성공", response.data);
      setUserData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data", error);
      }
    } finally {
      setLoading(false); // 데이터 요청 후 로딩 상태 업데이트
    }
  };

  // 마운트됐을 때 유저 정보 요청
  useEffect(() => {
    getUserData();
  }, []);

  // 일반 유저 더미 데이터
  const data1 = {
    write: ["", ""],
    like: ["", "", ""],
    save: ["", ""],
  };

  // 변호사 유저 더미 데이터
  const data2 = {
    point: 500,
    write: ["", ""],
    like: ["", ""],
    save: ["", "", ""],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="MyPageContainer">
      {userData.userType === "lawyer" ? (
        <LawyerInfo
          nickname={userData.nickname}
          profileImg={userData.profileImg}
          description={userData.lawyerDTO.description}
          phoneNumber={userData.lawyerDTO.phoneNumber}
          email={userData.email}
          point={data2.point}
          write={data2.write}
          like={data2.like}
          save={data2.save}
          getUserData={getUserData}
        />
      ) : (
        <UserInfo
          nickname={userData.nickname}
          profileImg={userData.profileImg}
          email={userData.email}
          write={data1.write}
          like={data1.like}
          save={data1.save}
          getUserData={getUserData}
        />
      )}

      <img className="adimg" src={ad} alt="adimg" />

      {userData.userType === "lawyer" ? (
        <LawyerLocation officeLocation={userData.lawyerDTO.officeLocation} />
      ) : null}

      {userData.userType === "lawyer" ? (
        <Tel phoneNumber={userData.lawyerDTO.phoneNumber} />
      ) : null}

      {userData.userType === "lawyer" ? (
        <Expertise
          getUserData={getUserData}
          expertise={userData.lawyerDTO.expertise}
        />
      ) : null}

      <Interest
        getUserData={getUserData}
        interests={userData.interests || []}
      />

      <Subscribe subscribe={userData.subscriptions || []} />
    </div>
  );
}

export default MyPageContainer;
