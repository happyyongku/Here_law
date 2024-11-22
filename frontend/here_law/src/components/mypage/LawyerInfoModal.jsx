import { useState } from "react";
import closeimg from "../../assets/mypage/closeimg.png";
import defualtImg from "../../assets/mypage/defaultimg.png";
import axiosInstance from "../../utils/axiosInstance";
import "./BasicInfoModal.css";

function BasicInfoModal({
  profileImg,
  nickname,
  description,
  phoneNumber,
  isModalOpen,
  closeModal,
  getUserData,
}) {
  const [newNickname, setNewNickname] = useState(nickname);
  const [newDescription, setNewDescription] = useState(description);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);

  const onChangeNickname = (e) => {
    setNewNickname(e.target.value);
  };

  const onChangeDescription = (e) => {
    setNewDescription(e.target.value);
  };

  const onChangePhoneNumber = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  // 변호사 정보 수정 요청
  const updateLawyerInfo = async () => {
    const token = localStorage.getItem("token");
    const formData = {
      nickname: newNickname,
      lawyerDTO: { description: newDescription, phoneNumber: newPhoneNumber },
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

        <div className="basic-info-modal-item">
          <div className="basic-info-modal-item-title">소개글</div>
          <input
            className="basic-info-modal-input"
            type="text"
            value={newDescription}
            onChange={onChangeDescription}
          />
        </div>

        <div className="basic-info-modal-item">
          <div className="basic-info-modal-item-title">전화번호 </div>
          <input
            className="basic-info-modal-input"
            type="text"
            value={newPhoneNumber}
            onChange={onChangePhoneNumber}
          />
        </div>
        <button className="update-complete" onClick={updateLawyerInfo}>
          수정 완료
        </button>
      </div>
    </div>
  );
}

export default BasicInfoModal;
