import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LawyerInfoModal from "./LawyerInfoModal";
import lawyermark from "../../assets/mypage/lawyermark.png";
import usersetting from "../../assets/mypage/usersetting.png";
import updateimg from "../../assets/mypage/updateimg.png";
import axiosInstance from "../../utils/axiosInstance";
import "./LawyerInfo.css";

function LawyerInfo({
  nickname,
  profileImg,
  point,
  description,
  phoneNumber,
  email,
  write,
  like,
  save,
  getUserData,
}) {
  const navigate = useNavigate();
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
  const toggleButton = () => setIsToggleOpen(!isToggleOpen);

  // 로그아웃 axios 요청
  const LogoutRequest = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const response = await axiosInstance.post(
        "/spring_api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("로그아웃 성공", response.data);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log("로그아웃 실패", error);
    }
  };

  return (
    <>
      <div className="lawyer-info-container">
        <div className="lawyer-profile-main">
          <div className="lawyer-profile-container">
            <img className="lawyer-img" src={profileImg} alt="lawyer-img" />
            <div className="lawyer-common-info">
              <p className="user-name">{nickname}</p>
              <img className="lawyer-mark" src={lawyermark} alt="lawyer-mark" />
            </div>
            <div className="user-point">
              POINT <span className="user-point-number">{point}</span>
            </div>
            <div className="lawyer-description">{description}</div>
            <p className="lawyer-email">{email}</p>
          </div>
          <div className="update-box">
            <img
              className="profile-img-updateimg"
              src={updateimg}
              alt="updateimg"
              onClick={openModal}
            />
            <img
              className="user-setting-button"
              src={usersetting}
              alt="settingbutton"
              onClick={toggleButton}
            />
            {isToggleOpen && (
              <div className="settings-dropdown">
                <div onClick={LogoutRequest}>로그아웃</div>
                <hr />
                <div className="" onClick={() => navigate("/signout")}>
                  회원탈퇴
                </div>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="lawyer-number-things">
          <div className="number-thing">
            <p className="number-size">{writePost}</p>
            <p className="text-size">작성한 게시글</p>
          </div>
          <div className="number-thing">
            <p className="number-size">{likePost}</p>
            <p className="text-size">추천한 게시글</p>
          </div>
          <div className="number-thing">
            <p className="number-size">{saveEx}</p>
            <p className="text-size">스크랩한 판례</p>
          </div>
        </div>
        {isModalOpen && (
          <LawyerInfoModal
            profileImg={profileImg}
            nickname={nickname}
            description={description}
            phoneNumber={phoneNumber}
            email={email}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            getUserData={getUserData}
          />
        )}
      </div>
    </>
  );
}

export default LawyerInfo;
