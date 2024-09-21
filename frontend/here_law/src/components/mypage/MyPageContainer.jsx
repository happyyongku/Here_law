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
  // 애초에 로그인을 했을 때 로그인 한 회원의 회원 정보를 가져오고
  // 리덕스에서 데이터를 뽑아서 쓰는 느낌으로 하면 될듯하다.

  // 일반 유저 더미 데이터
  const data1 = {
    id: 1,
    nickname: "김해수",
    profileImg: "",
    email: "gotnsla12@naver.com",
    userType: "normal",
    interests: ["부동산", "형사", "노동", "test1"],
    subscribe: ["민사", "test2"],
    write: ["", ""],
    like: ["", "", ""],
    save: ["", ""],
  };

  // 변호사 유저 더미 데이터
  const data2 = {
    id: 2,
    profileImg: "",
    email: "rudalssla12@naver.com",
    nickname: "강경민",
    userType: "lawyer",
    interests: ["부동산", "형사", "노동"],
    subscribe: ["민사"],
    point: 500,
    description: "실전에 강한 변호사. 이혼전문입니다.",
    officeLocation: "대전광역시 노은동 488-5, 강경민변호사 사무실 2F",
    phoneNumber: "042-894-2943",
    expertise: ["부동산", "형사"],
    write: ["", ""],
    like: ["", ""],
    save: ["", "", ""],
  };

  const [userType, setUserType] = useState(data2.userType);

  return (
    <div className="MyPageContainer">
      {userType === "lawyer" ? (
        <LawyerInfo
          nickname={data2.nickname}
          profileImg={data2.profileImg}
          point={data2.point}
          description={data2.description}
          email={data2.email}
          write={data2.write}
          like={data2.like}
          save={data2.save}
        />
      ) : (
        <UserInfo
          nickname={data1.nickname}
          profileImg={data1.profileImg}
          email={data1.email}
          write={data1.write}
          like={data1.like}
          save={data1.save}
        />
      )}

      <img className="adimg" src={ad} alt="adimg" />

      {userType === "lawyer" ? (
        <LawyerLocation officeLocation={data2.officeLocation} />
      ) : (
        <></>
      )}

      {userType === "lawyer" ? <Tel phoneNumber={data2.phoneNumber} /> : <></>}

      {userType === "lawyer" ? (
        <Expertise expertise={data2.expertise} />
      ) : (
        <></>
      )}

      <Interest interests={data1.interests} />

      <Subscribe subscribe={data1.subscribe} />
    </div>
  );
}

export default MyPageContainer;
