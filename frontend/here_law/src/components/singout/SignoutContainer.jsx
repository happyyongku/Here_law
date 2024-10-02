import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./SignoutContainer.css";

function Signout() {
  const navigate = useNavigate();
  // 비밀번호
  const [signoutPassword, setSignoutPassword] = useState("");

  // 비밀번호 상태 변경
  const onChangePassword = (e) => {
    setSignoutPassword(e.target.value);
  };

  // 회원탈퇴 axios 요청
  const signoutRequestButton = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    const formData = {
      password: signoutPassword,
    };
    try {
      const response = await axiosInstance.delete("/spring_api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });
      console.log("회원탈퇴 성공", response.data);
      // 로컬스토리지 삭제
      localStorage.removeItem("token");
      // 랜딩페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 실패", error);
    }
  };

  return (
    <div className="signout-page">
      <div className="signout-page-header">
        <h3 className="signout-page-header-title">회원 탈퇴</h3>
        <p className="signout-page-header-content">
          탈퇴시 계정은 삭제되며 복구되지 않습니다.
        </p>
      </div>
      <div className="signout-page-body">
        <label className="signout-page-body-label" htmlFor="password">
          비밀번호
        </label>
        <input
          className="signout-page-body-input"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          id="password"
          name="password"
          onChange={onChangePassword}
        />
        <button className="signout-button" onClick={signoutRequestButton}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
}

export default Signout;
