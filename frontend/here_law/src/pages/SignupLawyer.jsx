import { useState } from "react";
import SignupLawyer1 from "../components/signup/SignupLawyer1";
import SignupLawyer2 from "../components/signup/SignupLawyer2";
import SignupLawyer3 from "../components/signup/SignupLawyer3";
import SignupSuccess from "../components/signup/SignupSuccess";
import "../components/signup/Signup.css";
import "../components/signup/Circle.css";
import axiosInstance from "../utils/axiosInstance";

function SignupLawyer() {
  const [nickname, setNickname] = useState(""); // 이름
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interest, setInterest] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [officeLocation, setOfficeLocation] = useState("");

  const [pageIndex, setPageIndex] = useState(1); // 현재 페이지 상태

  // 페이지별 핸들러
  const handleNickname = (e) => setNickname(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleProfileImg = (file) => setProfileImg(file);
  const handleOfficeLocation = (e) => setOfficeLocation(e.target.value);

  // 페이지 전환
  const onClickNextButton = () => {
    if (pageIndex < 3) setPageIndex(pageIndex + 1);
  };

  // 회원가입 axios 요청
  const onClickSubmitButton = async () => {
    console.log(profileImg);
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImg) {
      formData.append("profileImgFile", profileImg);
    }
    formData.append("interests", JSON.stringify(interest));
    formData.append("userType", "lawyer");
    formData.append("lawyerDTO.description", description);
    formData.append("lawyerDTO.phoneNumber", phoneNumber);
    formData.append("lawyerDTO.officeLocation", officeLocation);
    formData.append("lawyerDTO.expertise", expertise);
    try {
      const response = await axiosInstance.post(
        "/spring_api/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("변호사 회원가입 성공", response.data);
      setPageIndex(4);
    } catch (error) {
      console.error("변호사요청 실패", error);
    }
  };

  // 페이지 렌더링
  const renderPageContent = () => {
    switch (pageIndex) {
      case 1:
        return (
          <SignupLawyer1
            nickname={nickname}
            setNickname={setNickname}
            email={email}
            password={password}
            handleNickname={handleNickname}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            onNext={onClickNextButton}
          />
        );
      case 2:
        return (
          <SignupLawyer2
            profileImg={profileImg}
            description={description}
            phoneNumber={phoneNumber}
            setDescription={setDescription}
            setPhoneNumber={setPhoneNumber}
            handleProfileImg={handleProfileImg}
            onNext={onClickNextButton}
          />
        );
      case 3:
        return (
          <SignupLawyer3
            expertise={expertise}
            setExpertise={setExpertise}
            officeLocation={officeLocation}
            setOfficeLocation={setOfficeLocation}
            handleOfficeLocation={handleOfficeLocation}
            onSubmit={onClickSubmitButton}
            interest={interest}
            setInterest={setInterest}
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
            <div className="signup-subtitle">
              변호사님, 회원가입을 시작합니다.
            </div>
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

export default SignupLawyer;
