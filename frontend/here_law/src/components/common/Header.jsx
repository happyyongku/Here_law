import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Header.css";
import logo from "../../assets/common/logo_white.gif";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져오기 위한 useLocation 훅 사용
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const toggleButton = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  // 로그아웃 axios 요청
  const LogoutRequest = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const response = await axiosInstance.post(
        "/spring_api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("로그아웃 성공", response.data);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log("로그아웃 실패", error);
    }
  };

  // 현재 경로에서 특정 경로를 확인하는 함수
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="Header">
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={() => navigate("/search")}
      />
      <div className="header-right">
        <div className="header-navigate">
          <div
            className={`header-navigate-item ${
              isActive("/magazine") ? "active" : ""
            }`}
            onClick={() => navigate("/magazine")}
          >
            매거진
          </div>
          <div
            className={`header-navigate-item ${
              isActive("/sojang/input") ? "active" : ""
            }`}
            onClick={() => navigate("/sojang/input")}
          >
            소장작성
          </div>
          <div
            className={`header-navigate-item ${
              isActive("/document/upload") ? "active" : ""
            }`}
            onClick={() => navigate("/document/upload")}
          >
            계약서분석
          </div>
        </div>
        <div className="my-page-circle-img" onClick={toggleButton}></div>
        {isToggleOpen && (
          <div className="toggle-options">
            <div
              className=""
              onClick={() => (navigate("/mypage"), toggleButton())}
            >
              마이페이지
            </div>
            <hr />
            <div
              onClick={() => (LogoutRequest(), toggleButton())}
              className="header-logout"
            >
              로그아웃
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
