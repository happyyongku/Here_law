import "./MagazineCustomCard.css";

function MagazineCustomCard({ item }) {
  // console.log(item.created_at);
  // console.log(item.content);
  // console.log(item.title);
  // console.log(item.likes);
  // console.log(item.view_count);
  // console.log(item.category);

  return (
    <div className="magazine-custom-card-container">
      <img src="" alt="" className="magazine-custom-card-img" />
      <div>
        <div className="magazine-custom-card-title">{item.title}</div>
        <div className="magazine-custom-card-etc-info">
          <div className="magazine-custom-view-rec">
            <div className="magazine-custom-view">{item.view_count}</div>
            <div className="magazine-custom-rec">{item.likes}</div>
          </div>
          <div className="magazine-custom-date">{item.created_at}</div>
        </div>
        <div className="magazine-custom-card-content">{item.content}</div>
      </div>
    </div>
  );
}

export default MagazineCustomCard;
