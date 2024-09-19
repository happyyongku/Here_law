import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
}

export default App;
