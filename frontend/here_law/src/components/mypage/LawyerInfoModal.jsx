import { useState } from "react";
import closeimg from "../../assets/mypage/closeimg.png";
import defualtImg from "../../assets/mypage/defaultimg.png";
import "./BasicInfoModal.css";

function BasicInfoModal({
  profileImg,
  nickname,
  description,
  phoneNumber,
  email,
  isModalOpen,
  closeModal,
}) {
  const [newNickname, setNewNickname] = useState(nickname);
  const [newDescription, setNewDescription] = useState(description);
  const [newEmail, setNewEmail] = useState(email);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  // console.log(phonenumber);

  const onChangeNickname = (e) => {
    setNewNickname(e.target.value);
  };

  const onChangeDescription = (e) => {
    setNewDescription(e.target.value);
  };

  const onChangeEmail = (e) => {
    setNewEmail(e.target.value);
  };

  const onChangePhoneNumber = (e) => {
    setNewPhoneNumber(e.target.value);
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
          <div className="basic-info-modal-item-title">이메일 </div>
          <input
            className="basic-info-modal-input"
            type="text"
            value={newEmail}
            onChange={onChangeEmail}
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
        <button className="update-complete">수정 완료</button>
      </div>
    </div>
  );
}

export default BasicInfoModal;
