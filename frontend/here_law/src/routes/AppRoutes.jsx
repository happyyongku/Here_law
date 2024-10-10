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
import CaseType from "../components/magazine/magazinemain/CaseType";
import MagazineDetail from "../components/magazine/magazinemain/MagazineDetail";
import MagazineMy from "../components/magazine/magazinemy/MagazineMy";
// import MagazineMy from "../components/magazine/magazinemy/MagazineMy";

import RentDocument from "../pages/RentDocument";
import DocumentUpload from "../pages/DocumentUpload";
import DocumentResult from "../pages/DocumentResult";

import SojangInput from "../pages/SojangInput";
import SojangResult from "../pages/SojangResult";

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
      <Route path="/search/case/:caseInfoId" element={<CaseDetail />} />

      <Route path="/document/upload" element={<DocumentUpload />} />
      <Route path="/document/result" element={<DocumentResult />} />

      <Route path="/sojang/input" element={<SojangInput />} />
      <Route path="/sojang/result" element={<SojangResult />} />

      <Route path="/magazine" element={<Magazine />}>
        <Route path="" element={<MagazineMain />}></Route>
        <Route path="hotfix" element={<MagazineHotfix />}></Route>
        <Route path="hotpost" element={<MagazineHotpost />}></Route>
        <Route path="case/:type" element={<CaseType />}></Route>
        <Route path="my" element={<MagazineMy />}></Route>
      </Route>
      <Route path="/magazine/:id" element={<MagazineDetail />}></Route>
    </Routes>
  );
}

export default AppRoutes;
