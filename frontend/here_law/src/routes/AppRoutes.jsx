import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import Header from "../components/common/Header";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}

export default AppRoutes;
