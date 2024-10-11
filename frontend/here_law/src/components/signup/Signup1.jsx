import axiosInstance from "../../utils/axiosInstance";

import React, { useState, useEffect } from "react";

function Signup1({ email, password, handleEmail, handlePassword, onNext }) {
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);
  const [emailCode, setEmailCode] = useState("");

  // 이메일 유효성 검사
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    handleEmail(e);
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setEmailValid(regex.test(emailInput));
  };

  // 비밀번호 유효성 검사
  const handlePwChange = (e) => {
    const pwInput = e.target.value;
    handlePassword(e);
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,}$/;
    setPwValid(regex.test(pwInput));
  };

  // 비밀번호 확인 검사
  const handlePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
    if (e.target.value !== password) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };

  // 인증번호 입력
  const handleEmailCodeChange = (e) => {
    setEmailCode(e.target.value);
  };

  // 모든 유효성 검사 통과 여부
  useEffect(() => {
    if (emailValid && pwValid && password === passwordConfirm && emailCode) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, pwValid, password, passwordConfirm, emailCode]);

  // 이메일-인증번호 요청 axios
  const emailSend = async () => {
    const emailData = {
      email: email,
    };
    console.log(emailData);
    try {
      const response = await axiosInstance.post(
        "/spring_api/send-verification-code",
        emailData
      );
      console.log(response.data);
    } catch (error) {
      console.error(`Error : ${error}`);
      if (error.response) {
        console.error("응답 오류 ", error.response.data);
        console.error("응답 상태 코드", error.response.status);
        console.error("응답 헤더", error.response.headers);
      } else {
        console.error("요청 설정 오류", error.message);
      }
      console.error("전체 에러 객체:", error.config);
    }
  };

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [forEmailErrorMsg, setForEmailErrorMsg] = useState(false);

  // 이메일 인증 확인 axios
  const emailCheck = async () => {
    const codeData = {
      email: email,
      code: emailCode,
    };
    try {
      const response = await axiosInstance.post(
        "/spring_api/verify-code",
        codeData
      );
      console.log("인증 성공");
      setIsEmailChecked(true);
      setForEmailErrorMsg(false);
    } catch (error) {
      console.error("요청 실패", error);
      setForEmailErrorMsg(true);
    }
  };

  return (
    <div>
      <div className="signup-input-title">이메일 주소</div>
      <div className="signup-verify-input-box">
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={handleEmailChange}
        />
        <button className="signup-verify-button-black" onClick={emailSend}>
          인증 요청
        </button>
      </div>
      <div className="error-message-wrap">
        {!emailValid && email.length > 0 && (
          <div>이메일 형식에 맞게 입력해주세요.</div>
        )}
      </div>
      <div
        style={{
          border: "none",
          borderBottom: "1px solid #d7dedd",
          marginTop: "8px",
        }}
        className="signup-verify-input-box"
      >
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="인증번호를 입력해주세요"
          value={emailCode}
          onChange={handleEmailCodeChange}
        />
        {!isEmailChecked ? (
          <button className="signup-verify-button-orange" onClick={emailCheck}>
            인증
          </button>
        ) : (
          <button
            className="signup-verify-button-orange"
            style={{ backgroundColor: "#ff5e00", color: "white" }}
          >
            완료
          </button>
        )}
      </div>
      <div className="error-message-wrap">
        {forEmailErrorMsg && <div>인증번호가 일치하지 않습니다 </div>}
      </div>

      <div className="signup-input-title">비밀번호</div>
      <div className="signup-input-box">
        <input
          type="password"
          className="signup-input-tag"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={handlePwChange}
        />
      </div>
      <div className="error-message-wrap">
        {!pwValid && password.length > 0 && (
          <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
        )}
      </div>

      <div className="signup-input-title">비밀번호 확인</div>
      <div className="signup-input-box">
        <input
          type="password"
          className="signup-input-tag"
          placeholder="비밀번호를 다시 입력해주세요"
          value={passwordConfirm}
          onChange={handlePasswordConfirm}
        />
      </div>
      <div className="error-message-wrap">
        {passwordError && <div>{passwordError}</div>}
      </div>

      <div>
        <button
          className="signup-next-button"
          onClick={onNext}
          disabled={notAllow}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Signup1;
