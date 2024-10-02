import React, { useRef, useState, useEffect } from "react";
import cameraImage from "../../assets/signup/camera.png";

function SignUp2({ handleProfileImg, onNext, nickname, setNickname }) {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [notAllow, setNotAllow] = useState(true);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일인지 확인
      const fileType = file.type.split("/")[0];
      if (fileType !== "image") {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      handleProfileImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 닉네임 유효성 검사
  useEffect(() => {
    if (nickname.trim()) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [nickname]);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

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

      <div className="signup-input-title">닉네임</div>
      <div className="signup-input-box">
        <input
          type="text"
          className="signup-input-tag"
          placeholder="10자 이내 한글 또는 영어"
          value={nickname}
          onChange={handleNicknameChange}
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

export default SignUp2;
