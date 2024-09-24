import { useState } from "react";
import BasicInfoModal from "./BasicInfoModal";
import normaluserimg from "../../assets/mypage/normaluserimg.png";
import usersetting from "../../assets/mypage/usersetting.png";
import updateimg from "../../assets/mypage/updateimg.png";
import "./UserInfo.css";

function UserInfo({ nickname, profileImg, email, write, like, save }) {
  const [writePost, setWritePost] = useState(write.length);
  const [likePost, setLikePost] = useState(like.length);
  const [saveEx, setSaveEx] = useState(save.length);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
    setIsToggleOpen(false);
  };
  const closeModal = () => setIsModalOpen(false);

  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const toggleButton = () => {
    setIsToggleOpen(!isToggleOpen);
  };

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
            <p className="normal-user-name">{nickname}</p>
          </div>
          <p className="normal-user-email">{email}</p>
        </div>
        <div className="update-box">
          <img
            className="normal-user-name-change"
            src={updateimg}
            alt="updateimg"
            onClick={openModal}
          />
          <img
            className="normal-user-setting"
            src={usersetting}
            alt="usersettingimg"
            onClick={toggleButton}
          />
          {isToggleOpen && (
            <div className="settings-dropdown">
              <div className="">회원탈퇴</div>
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="user-info-bottom">
        <div className="user-info-number-box">
          <div className="normal-user-number">{writePost}</div>
          <div className="normal-user-number-text">작성한 게시글</div>
        </div>
        <div className="user-info-number-box">
          <div className="normal-user-number">{likePost}</div>
          <div className="normal-user-number-text">추천한 게시글</div>
        </div>
        <div className="user-info-number-box">
          <div className="normal-user-number">{saveEx}</div>
          <div className="normal-user-number-text">스크랩한 판례</div>
        </div>
      </div>
      {isModalOpen ? (
        <BasicInfoModal
          profileImg={profileImg}
          nickname={nickname}
          email={email}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default UserInfo;
