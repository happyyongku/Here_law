import lawyer from "../../../assets/lawyer/lawyer.png";
import lawyer1 from "../../../assets/lawyer/lawyer1.jfif";
import lawyer2 from "../../../assets/lawyer/lawyer2.jpg";
import lawyer3 from "../../../assets/lawyer/lawyer3.jpg";
import lawyer4 from "../../../assets/lawyer/lawyer4.jpg";

import LawyerDetail from "./LawyerDetail";
import "./CaseLawyerRec.css";

function CaseLawyerRec({ item, onClick, setLawyerId, index }) {
  // console.log(item.lawyer_id);
  const lawyerArray = [lawyer, lawyer1, lawyer2, lawyer3, lawyer4];
  return (
    <div className="lawyer-rec-container">
      <img
        src={lawyerArray[index]}
        alt="lawyerimg"
        className="lawyer-rec-img"
      />
      <div
        className="lawyer-rec-text-box"
        onClick={() => {
          onClick(), setLawyerId(item.lawyer_id);
        }}
      >
        <div className="lawyer-rec-nickname">{item.lawyer_name}</div>
        <span className="lawyer-rec-expertise">{item.expertise_main}</span>
        <div className="lawyer-rec-desc">{item.description}</div>
        <div className="lawyer-rec-phone">{item.phone_number}</div>
      </div>
    </div>
  );
}

export default CaseLawyerRec;
