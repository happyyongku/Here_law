import { useNavigate } from "react-router-dom";

function Landing() {
  const navigation = useNavigate();

  return (
    <>
      <h3>landing page</h3>
      <button onClick={() => navigation("/login")}>서비스 이용하기!</button>
    </>
  );
}

export default Landing;
