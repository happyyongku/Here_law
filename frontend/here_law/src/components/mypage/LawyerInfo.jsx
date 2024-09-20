import "./LawyerInfo.css";
import lawyermark from "../../assets/mypage/lawyermark.png";
import usersetting from "../../assets/mypage/usersetting.png";
import defaultimg from "../../assets/mypage/defaultimg.png";
import updateimg from "../../assets/mypage/updateimg.png";

function LawyerInfo() {
  return (
    <>
      <div className="lawyer-info-container">
        <div className="lawyer-profile-main">
          <div className="lawyer-profile-container">
            <img className="lawyer-img" src={defaultimg} alt="lawyer-img" />
            <div className="lawyer-common-info">
              <p className="user-name">강경민</p>
              <img className="lawyer-mark" src={lawyermark} alt="lawyer-mark" />
              <img
                className="profile-img-updateimg"
                src={updateimg}
                alt="updateimg"
              />
            </div>
            <div className="user-point">
              POINT <span className="user-point-number">500</span>
            </div>
            <div className="lawyer-description">
              실전에 강한 변호사. 이혼 전문입니다.
            </div>
            <p className="lawyer-email">gotnsla12@naver.com</p>
          </div>
          <img className="user-setting-button" src={usersetting} alt="" />
        </div>
        <hr />
        <div className="lawyer-number-things">
          <div className="number-thing">
            <p className="number-size">12</p>
            <p className="text-size">작성한 게시글</p>
          </div>
          <div className="number-thing">
            <p className="number-size">16</p>
            <p className="text-size">추천한 게시글</p>
          </div>
          <div className="number-thing">
            <p className="number-size">45</p>
            <p className="text-size">스크랩한 판례</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LawyerInfo;
