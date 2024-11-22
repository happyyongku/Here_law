import { Outlet } from "react-router-dom";

function MagazineContainer() {
  return (
    // 매거진 해더 들어가면 좋을듯 하다
    <div>
      {/* <h2>네비게이션 바</h2> */}
      <Outlet />
    </div>
  );
}

export default MagazineContainer;
