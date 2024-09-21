import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import SingupLawyer from "../pages/SignupLawyer";
import Singup from "../pages/Signup";
import Header from "../components/common/Header";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Singup />} />
      <Route path="/signuplawyer" element={<SingupLawyer />} />
    </Routes>
  );
}

export default AppRoutes;
