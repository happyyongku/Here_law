import { useState } from "react";
import UserInfo from "./UserInfo";
import LawyerLocation from "./LawyerLocation";
import Expertise from "./Expertise";
import Tel from "./Tel";
import Interest from "./Interest";
import Subscribe from "./Subscribe";
import LawyerInfo from "./LawyerInfo";
import ad from "../../assets/mypage/ad.png";
import "./MyPageContainer.css";

function MyPageContainer() {
  // 여기서 axios로 user 정보 호출
  // usertype 임시 데이터
  const [userType, setUserType] = useState("lawyer");

  return (
    <div className="MyPageContainer">
      {userType === "lawyer" ? <LawyerInfo /> : <UserInfo />}

      <img className="adimg" src={ad} alt="adimg" />

      {userType === "lawyer" ? <LawyerLocation /> : <></>}

      {userType === "lawyer" ? <Tel /> : <></>}

      {userType === "lawyer" ? <Expertise /> : <></>}

      {userType === "normal" ? <Interest /> : <></>}

      <Subscribe />
    </div>
  );
}

export default MyPageContainer;
