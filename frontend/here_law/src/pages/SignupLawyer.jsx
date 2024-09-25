import { useState } from "react";
import SignupLawyer1 from "../components/signup/SignupLawyer1";
import SignupLawyer2 from "../components/signup/SignupLawyer2";
import SignupLawyer3 from "../components/signup/SignupLawyer3";
import SignupSuccess from "../components/signup/SignupSuccess";
import "../components/signup/Signup.css";
import "../components/signup/Circle.css";

function SignupLawyer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImg, setProfileImg] = useState(null);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [expertise, setExpertise] = useState([]);
  const [location, setLocation] = useState("");
  const [qualification, setQualification] = useState("");

  const [pageIndex, setPageIndex] = useState(1); // 현재 페이지 상태

  // 페이지별 핸들러
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleProfileImg = (file) => setProfileImg(file);
  const handleDescription = (e) => setDescription(e.target.value);
  const handlePhoneNumber = (e) => setPhoneNumber(e.target.value);
  const handleLocation = (e) => setLocation(e.target.value);
  const handleQualification = (e) => setQualification(e.target.value);

  // 전문영역 리스트 - 추가
  const addExpertise = (newExpertise) => {
    setExpertise([...expertise, newExpertise]);
  };

  // 전문영역 리스트 - 삭제
  const removeExpertise = (index) => {
    const newExpertiseList = expertise.filter((_, i) => i !== index);
    setExpertise(newExpertiseList);
  };

  // 페이지 전환
  const onClickNextButton = () => {
    if (pageIndex < 3) setPageIndex(pageIndex + 1);
  };

  const onClickSubmitButton = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("profileImg", profileImg);
    formData.append("description", description);
    formData.append("phoneNumber", phoneNumber);
    formData.append("expertise", JSON.stringify(expertise));
    formData.append("location", location);
    formData.append("qualification", qualification);

    // 회원가입 데이터 전송?
    console.log("회원가입 데이터:", formData);

    setPageIndex(4);
  };

  // 페이지 렌더링
  const renderPageContent = () => {
    switch (pageIndex) {
      case 1:
        return (
          <SignupLawyer1
            name={name}
            email={email}
            password={password}
            handleName={handleName}
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
            handleProfileImg={handleProfileImg}
            handleDescription={handleDescription}
            handlePhoneNumber={handlePhoneNumber}
            onNext={onClickNextButton}
          />
        );
      case 3:
        return (
          <SignupLawyer3
            expertise={expertise}
            location={location}
            qualification={qualification}
            addExpertise={addExpertise}
            removeExpertise={removeExpertise}
            handleLocation={handleLocation}
            handleQualification={handleQualification}
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
