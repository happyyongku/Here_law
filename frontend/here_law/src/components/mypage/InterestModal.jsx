import close from "../../assets/mypage/closeimg.png";
import criminalImage from "../../assets/signup/criminal.png";
import laborImage from "../../assets/signup/labor.png";
import carImage from "../../assets/signup/car.png";
import keyImage from "../../assets/signup/key.png";
import realImage from "../../assets/signup/real.png";
import docImage from "../../assets/signup/doc.png";
import compensationImage from "../../assets/signup/compensation.png";
import divorceImage from "../../assets/signup/divorce.png";
import familyImg from "../../assets/signup/family.png";
import cashImg from "../../assets/signup/cash.png";
import "./InterestModal.css";

function InterestModal({ closeModal }) {
  const interestOptions1 = [
    { icon: criminalImage, name: "가족법" },
    { icon: keyImage, name: "형사법" },
    { icon: carImage, name: "민사법" },
    { icon: laborImage, name: "부동산 및 건설" },
  ];

  const interestOptions2 = [
    { icon: realImage, name: "회사 및 상사법" },
    { icon: realImage, name: "국제 및 무역법" },
    { icon: docImage, name: "노동 및 고용법" },
    { icon: compensationImage, name: "조세 및 관세법" },
  ];

  const interestOptions3 = [
    { icon: divorceImage, name: "지적재산권" },
    { icon: familyImg, name: "의료 및 보험법" },
    { icon: cashImg, name: "행정 및 공공법" },
  ];

  return (
    <div className="interest-modal-container">
      <div className="interest-modal-content-box">
        <div className="expertise-modal-header">
          <h3>관심분야</h3>
          <img
            className="expertise-modal-close-img"
            src={close}
            alt="closeimg"
            onClick={closeModal}
          />
        </div>
        <div className="interest-modal-body">
          <div>
            {interestOptions1.map((item, index) => (
              <div key={index}>
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
          <div>
            {interestOptions2.map((item, index) => (
              <div key={index}>
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
          <div>
            {interestOptions3.map((item, index) => (
              <div key={index}>
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterestModal;
