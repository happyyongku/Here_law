import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/common/logo.gif";

function Header() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="Header" onClick={() => navigate("/")}> {/* 클릭 시 홈으로 이동 */}
      <img src={logo} alt="logo" className="logo" /> {/* 로고 이미지 추가 */}
    </div>
  );
}

export default Header;
