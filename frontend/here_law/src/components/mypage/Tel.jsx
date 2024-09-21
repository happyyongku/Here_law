import "./Tel.css";

function Tel({ phoneNumber }) {
  return (
    <div className="tel-container">
      <h3 className="tel-container-title">전화번호</h3>
      <p className="tel-number">{phoneNumber}</p>
    </div>
  );
}

export default Tel;
