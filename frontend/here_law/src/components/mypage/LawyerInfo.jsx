import { useState } from "react";
import lawyermark from "../../assets/mypage/lawyermark.png";
import usersetting from "../../assets/mypage/usersetting.png";
import defaultimg from "../../assets/mypage/defaultimg.png";
import updateimg from "../../assets/mypage/updateimg.png";
import "./LawyerInfo.css";

function LawyerInfo({
  nickname,
  profileImg,
  point,
  description,
  email,
  write,
  like,
  save,
}) {
  const [writePost, setWritePost] = useState(write.length);
  const [likePost, setLikePost] = useState(like.length);
  const [saveEx, setSaveEx] = useState(save.length);

  return (
    <>
      <div className="lawyer-info-container">
        <div className="lawyer-profile-main">
          <div className="lawyer-profile-container">
            <img className="lawyer-img" src={defaultimg} alt="lawyer-img" />
            <div className="lawyer-common-info">
              <p className="user-name">{nickname}</p>
              <img className="lawyer-mark" src={lawyermark} alt="lawyer-mark" />
              <img
                className="profile-img-updateimg"
                src={updateimg}
                alt="updateimg"
              />
            </div>
            <div className="user-point">
              POINT <span className="user-point-number">{point}</span>
            </div>
            <div className="lawyer-description">{description}</div>
            <p className="lawyer-email">{email}</p>
          </div>
          <img className="user-setting-button" src={usersetting} alt="" />
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
      </div>
    </>
  );
}

export default LawyerInfo;