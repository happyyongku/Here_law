import "./Card.css";

function Card({ title, subtitle, icon }) {
  return (
    <div className="card-box">
      <div className="card-text-wrap">
        <div className="card-title">{title}</div>
        <div className="card-subtitle">{subtitle}</div>
      </div>
      <div className="card-image-box">
        <img src={icon} alt="card icon" className="card-icon" />
      </div>
    </div>
  );
}

export default Card;
