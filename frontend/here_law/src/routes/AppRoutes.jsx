import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import SingupLawyer from "../pages/SignupLawyer";
import Singup from "../pages/Signup";
import Search from "../pages/Search";
import CaseList from "../pages/CaseList";
import CaseDetail from "../components/search/caselist/CaseDetail";
import Signout from "../pages/Signout";

// 매거진 컴포넌트 모음
import Magazine from "../pages/Magazine";
import MagazineMain from "../components/magazine/magazinemain/MagazineMain";
import MagazineHotfix from "../components/magazine/magazinehotfix/MagazineHotfix";
import MagazineHotpost from "../components/magazine/magazinehotpost/MagazineHotpost";
// import MagazineMy from "../components/magazine/magazinemy/MagazineMy";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log(token);

  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Singup />} />
      <Route path="/signout" element={<Signout />} />
      <Route path="/signuplawyer" element={<SingupLawyer />} />

      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />

      <Route path="/search" element={<Search />} />

      <Route path="/search/case" element={<CaseList />} />
      <Route path="/search/case/:id" element={<CaseDetail />} />

      <Route path="/magazine" element={<Magazine />}>
        <Route path="" element={<MagazineMain />}></Route>
        <Route path="hotfix" element={<MagazineHotfix />}></Route>
        <Route path="hotpost" element={<MagazineHotpost />}></Route>
        {/* <Route path="my" element={<MagazineMy />}></Route> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
