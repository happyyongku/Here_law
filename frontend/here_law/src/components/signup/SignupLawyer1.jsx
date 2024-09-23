import React, { useState, useEffect } from "react";

function SignupLawyer1({
  email,
  password,
  handleEmail,
  handlePassword,
  onNext,
}) {
  const [name, setName] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);
  const [emailCode, setEmailCode] = useState("");

  // 이름
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setShowNameError(false); // 이름 입력 시 오류 메시지 사라짐
    }
  };

  const handleNameFocus = () => {
    setIsNameFocused(true); // 포커스를 얻으면 상태 변경
    if (name.trim().length === 0) {
      setShowNameError(true); // 글자 길이 0이면 에러
    }
  };
  const handleNameBlur = () => {
    if (!name.trim()) {
      setShowNameError(true); // 입력 없이 포커스 나가면 에러
    } else {
      setShowNameError(false);
    }
    setIsNameFocused(false); // 포커스를 나가면 상태 변경
  };

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
    if (
      name.trim() &&
      emailValid &&
      pwValid &&
      password === passwordConfirm &&
      emailCode
    ) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [name, emailValid, pwValid, password, passwordConfirm, emailCode]);

  return (
    <div>
      <div className="signup-input-title">이름</div>
      <div className="signup-input-box">
        <input
          type="text"
          className="signup-input-tag"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={handleNameChange}
          onFocus={handleNameFocus}
          onBlur={handleNameBlur}
        />
      </div>
      {showNameError && (
        <div className="error-message-wrap">
          <div>이름은 필수 입력값입니다.</div>
        </div>
      )}

      <div className="signup-input-title">이메일 주소</div>
      <div className="signup-verify-input-box">
        <input
          type="text"
          className="signup-verify-input-tag"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={handleEmailChange}
        />
        <button className="signup-verify-button-black">인증 요청</button>
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
        <button className="signup-verify-button-orange">인증</button>
      </div>
      {/* <div className="error-message-wrap">
        {!emailValid && email.length > 0 && (
          <div>인증번호가 일치합니다/일치하지 않습니다 </div>
        )}
      </div> */}

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

export default SignupLawyer1;
