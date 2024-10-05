import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import SingupLawyer from "../pages/SignupLawyer";
import Singup from "../pages/Signup";
import Search from "../pages/Search";
import CaseList from "../pages/CaseList";
import CaseDetail from "../components/search/caselist/CaseDetail";
import Magazine from "../pages/Magazine";
import Signout from "../pages/Signout";
import RentDocument from "../pages/RentDocument";
import RentDocumentUpload from "../pages/RentDocumentUpload";

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

      <Route path="/magazine" element={<Magazine />} />

      <Route path="/rentdocument" element={<RentDocument />} />
      <Route path="/rentdocument/upload" element={<RentDocumentUpload />} />
    </Routes>
  );
}

export default AppRoutes;
