import MagazineHotfixCard from "./MagazineHotfixCard";
import "./MagazineHotfix.css";

function MagazineHotfix() {
  const something = ["", "", ""];

  return (
    <div className="magazine-hotfix-container">
      <div className="magazine-hotfix-title">
        <div className="hotfix-text">패치노트 :</div>
        <div className="hotfix-text">법률 개정사항</div>
      </div>
      <div className="magazine-hotfix-content">
        {something.map((item, index) => (
          <MagazineHotfixCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default MagazineHotfix;
