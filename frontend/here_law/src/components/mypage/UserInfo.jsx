import normaluserimg from "../../assets/mypage/normaluserimg.png";
import usersetting from "../../assets/mypage/usersetting.png";
import updateimg from "../../assets/mypage/updateimg.png";
import "./UserInfo.css";

function UserInfo() {
  return (
    <div className="user-info-container">
      <div className="user-info-header">
        <div className="user-basic-info">
          <img
            className="normal-user-img"
            src={normaluserimg}
            alt="normaluserimg"
          />
          <div className="name-and-update">
            <p className="normal-user-name">노은맨</p>
            <img
              className="normal-user-name-change"
              src={updateimg}
              alt="updateimg"
            />
          </div>
          <p className="normal-user-email">gotnsla12@naver.com</p>
        </div>
        <img
          className="normal-user-setting"
          src={usersetting}
          alt="usersettingimg"
        />
      </div>

      <hr />

      <div className="user-info-bottom">
        <div className="user-info-number-box">
          <div className="normal-user-number">32</div>
          <div className="normal-user-number-text">작성한 게시글</div>
        </div>
        <div className="user-info-number-box">
          <div className="normal-user-number">15</div>
          <div className="normal-user-number-text">추천한 게시글</div>
        </div>
        <div className="user-info-number-box">
          <div className="normal-user-number">21</div>
          <div className="normal-user-number-text">스크랩한 판례</div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
