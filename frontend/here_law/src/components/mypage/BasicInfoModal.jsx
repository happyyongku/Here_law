import { useState } from "react";
import closeimg from "../../assets/mypage/closeimg.png";
import defualtImg from "../../assets/mypage/defaultimg.png";
import axiosInstance from "../../utils/axiosInstance";
import "./BasicInfoModal.css";

function BasicInfoModal({
  profileImg,
  nickname,
  email,
  isModalOpen,
  closeModal,
  getUserData,
}) {
  const [newNickname, setNewNickname] = useState(nickname);
  // const [newEmail, setNewEmail] = useState(email);

  const onChangeNickname = (e) => {
    setNewNickname(e.target.value);
  };

  // const onChangeEmail = (e) => {
  //   setNewEmail(e.target.value);
  // };

  const updateUserInfo = async () => {
    const token = localStorage.getItem("token");
    const formData = {
      nickname: newNickname,
    };
    try {
      const response = await axiosInstance.put(
        "/spring_api/user/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("회원 기본 정보 수정 성공", response.data);
      // 수정 성공하면 닫자.
      closeModal();
      getUserData();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data", error);
        closeModal();
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="basic-info-modal-container">
      <div className="basic-info-modal-contents-box">
        <img
          onClick={closeModal}
          className="close-button-img"
          src={closeimg}
          alt="close-button"
        />
        <div className="basic-info-modal-item">
          <div className="basic-info-modal-item-title">프로필 사진</div>
          <img className="profile-img-update" src={defualtImg} alt="" />
        </div>
        <div className="basic-info-modal-item">
          <div className="basic-info-modal-item-title">이름</div>
          <input
            className="basic-info-modal-input"
            type="text"
            value={newNickname}
            onChange={onChangeNickname}
          />
        </div>
        {/* <div className="basic-info-modal-item">
          <div className="basic-info-modal-item-title">이메일 </div>
          <input
            className="basic-info-modal-input"
            type="text"
            value={newEmail}
            onChange={onChangeEmail}
          />
        </div> */}
        <button className="update-complete" onClick={updateUserInfo}>
          수정 완료
        </button>
      </div>
    </div>
  );
}

export default BasicInfoModal;
