import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  const handleEmail = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    setEmailValid(regex.test(emailInput));
  };

  const handlePw = (e) => {
    const pwInput = e.target.value;
    setPassword(pwInput);
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,}$/;
    setPwValid(regex.test(pwInput));
  };

  useEffect(() => {
    if (emailValid && pwValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [emailValid, pwValid]);

  return (
    <div className="login-page">
      <div className="contents-box">
        <div className="login-header">
          키워드, AI 기반
          <br />
          판례 검색 플랫폼,
          <span style={{ fontWeight: "700", color: "#ff5e00" }}> 여기로</span>
          <br />
        </div>
        <span className="login-subtitle">최적의 변호사와 상담해 보세요.</span>

        <div className="login-input-container">
          <div>
            <div className="login-input-title">이메일</div>
            <div className="login-input-box">
              <input
                type="email"
                className="input-tag"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={handleEmail}
              />
            </div>
            <div className="error-message-wrap">
              {!emailValid && email.length > 0 && (
                <div>이메일 형식에 맞게 입력해주세요</div>
              )}
            </div>
          </div>

          <div>
            <div className="login-input-title">비밀번호</div>
            <div className="login-input-box">
              <input
                type="password"
                className="input-tag"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={handlePw}
              />
            </div>
            <div className="error-message-wrap">
              {!pwValid && password.length > 0 && (
                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
              )}
            </div>
          </div>

          {!notAllow ? (
            <button
              className="login-button-activate"
              onClick={() => {
                console.log(notAllow);
              }}
            >
              로그인
            </button>
          ) : (
            <button className="login-button-deactivate">로그인</button>
          )}
        </div>

        <div className="login-checkbox">
          <div>
            <input type="checkbox" />
            <span className="check-ele">로그인 상태 유지</span>
          </div>
          <div className="check-ele">비밀번호 찾기</div>
        </div>

        <div className="login-subtitle">
          아직 회원이 아니세요? <br /> 지금 바로 가입하고 AI 기반 서비스를
          이용해보세요.
        </div>

        <div className="login-buttons">
          <button className="lawyer-signup-button">변호사 회원가입</button>
          <button className="common-signup-button">회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;