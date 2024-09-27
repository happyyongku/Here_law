import React from "react";
import { useNavigate } from "react-router-dom";
import checkGif from "../../assets/signup/check11.gif";

function SignupSuccess() {
  const navigate = useNavigate();

  // const GotoSearch = () => {
  //   navigate("/search");
  // };

  return (
    <div>
      <img src={checkGif} alt="Check" className="signup-success-checkimg" />

      <h1
        style={{
          color: "#f55e00",
          fontSize: "28px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        환영합니다!
      </h1>
      <p
        style={{
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        <span style={{ fontWeight: "700" }}>&apos;이름&apos;</span> 님 <br />
        여기로 서비스 가입을 축하드립니다.
      </p>

      <button
        onClick={() => {
          navigate("/login");
        }}
        className="signup-success-go-button"
      >
        서비스 이용하기
      </button>
    </div>
  );
}

export default SignupSuccess;
