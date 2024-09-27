import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import SingupLawyer from "../pages/SignupLawyer";
import Singup from "../pages/Signup";
import Search from "../pages/Search";
import CaseList from "../pages/CaseList";
import CaseDetail from "../components/search/caselist/CaseDetail";
import Magazine from "../pages/Magazine";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Singup />} />
      <Route path="/signuplawyer" element={<SingupLawyer />} />

      <Route path="/mypage" element={<MyPage />} />

      <Route path="/search" element={<Search />} />

      <Route path="/search/case" element={<CaseList />} />
      <Route path="/search/case/:id" element={<CaseDetail />} />

      <Route path="/magazine" element={<Magazine />} />
    </Routes>
  );
}

export default AppRoutes;
