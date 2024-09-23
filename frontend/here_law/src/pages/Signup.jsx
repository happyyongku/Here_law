import { useState } from "react";
import Signup1 from "../components/signup/Signup1";
import Signup2 from "../components/signup/Signup2";
import Signup3 from "../components/signup/Signup3";
import SignupSuccess from "../components/signup/SignupSuccess";
import "../components/signup/Signup.css";
import "../components/signup/Circle.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImg, setProfileImg] = useState(null);
  const [nickname, setNickname] = useState("");

  const [interest, setInterest] = useState([]);

  const [pageIndex, setPageIndex] = useState(1); // 현재 페이지 상태

  // 페이지별 핸들러
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleProfileImg = (file) => setProfileImg(file);
  const handleNickname = (e) => setNickname(e.target.value);

  // 관심영역 리스트 - 추가
  const addInterest = (newInterest) => {
    setInterest([...interest, newInterest]);
  };

  // 전문영역 리스트 - 삭제
  const removeInterest = (index) => {
    const newInterestList = interest.filter((_, i) => i !== index);
    setInterest(newInterestList);
  };

  // 페이지 전환
  const onClickNextButton = () => {
    if (pageIndex < 3) setPageIndex(pageIndex + 1);
  };

  const onClickSubmitButton = () => {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    formData.append("profileImg", profileImg);
    formData.append("nickname", nickname);

    formData.append("interest", JSON.stringify(interest));

    // 회원가입 데이터 전송?
    console.log("회원가입 데이터:", formData);

    setPageIndex(4);
  };

  // 페이지 렌더링
  const renderPageContent = () => {
    switch (pageIndex) {
      case 1:
        return (
          <Signup1
            email={email}
            password={password}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            onNext={onClickNextButton}
          />
        );
      case 2:
        return (
          <Signup2
            profileImg={profileImg}
            nickname={nickname}
            handleProfileImg={handleProfileImg}
            onNext={onClickNextButton}
          />
        );
      case 3:
        return (
          <Signup3
            interest={interest}
            addInterest={addInterest}
            removeInterest={removeInterest}
            onSubmit={onClickSubmitButton}
          />
        );
      case 4:
        return <SignupSuccess />;
      default:
        return null;
    }
  };
  return (
    <div className="signup-page">
      {pageIndex !== 4 && (
        <>
          <div className="signup-title">
            키워드, AI 기반
            <br />
            판례 검색 플랫폼, <span style={{ color: "#FF5E00" }}>여기로</span>
            <br />
            <div className="signup-subtitle">회원가입을 시작합니다.</div>
          </div>
        </>
      )}

      <div className="signup-content-wrap">{renderPageContent()}</div>

      {pageIndex !== 4 && (
        <div className="circle-container">
          <div
            className={`circle ${pageIndex === 1 ? "orange" : "gray"}`}
          ></div>
          <div
            className={`circle ${pageIndex === 2 ? "orange" : "gray"}`}
          ></div>
          <div
            className={`circle ${pageIndex === 3 ? "orange" : "gray"}`}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Signup;
