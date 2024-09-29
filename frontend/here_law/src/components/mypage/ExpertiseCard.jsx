import "./ExpertiseCard.css";

function ExpertiseCard({ item }) {
  return (
    <div className="expertisecard-container">
      <div className="expertise-cate">{item}</div>
    </div>
  );
}

export default ExpertiseCard;
