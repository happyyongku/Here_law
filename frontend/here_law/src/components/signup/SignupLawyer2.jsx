import React, { useRef, useState, useEffect } from "react";
import cameraImage from "../../assets/signup/camera.png";

function SignUpLawyer2({
  handleProfileImg,
  onNext,
  description,
  phoneNumber,
  setDescription,
  setPhoneNumber,
}) {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [notAllow, setNotAllow] = useState(true);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleProfileImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // 유효성 검사
  useEffect(() => {
    if (description.trim() && phoneNumber.trim()) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [description, phoneNumber]);

  return (
    <div>
      <div className="signup-input-title">프로필 이미지</div>
      <div className="signup-profileimg-wrap">
        <div
          className="signup-profileimg-upload"
          onClick={() => fileInputRef.current.click()}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="signup-profileimg-preview"
            />
          ) : (
            <img
              src={cameraImage}
              alt="Upload Icon"
              style={{ width: "47px", height: "47px" }}
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      <div className="signup-input-title">소개글</div>
      <div className="signup-input-box">
        <input
          type="text"
          className="signup-input-tag"
          placeholder="100자 이내로 작성해주세요"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="signup-input-title">전화번호</div>
      <div className="signup-input-box">
        <input
          type="text"
          className="signup-input-tag"
          placeholder="전화번호를 입력해주세요"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>

      <div>
        <button
          className="signup-next-button"
          onClick={onNext}
          disabled={notAllow}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default SignUpLawyer2;
