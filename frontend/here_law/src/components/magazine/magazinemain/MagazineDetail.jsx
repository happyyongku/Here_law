import "./MagazineDetail.css";

// 임시 사진
import image from "../../../assets/magazine/image.png";

function MagazineDetail() {
  // 포스팅 디테일 axios 요청

  //   포스팅 추천하기 axios 요청

  return (
    <div className="magazine-detail-container">
      <div className="magazine-detail-header">
        <div className="magazine-detail-header-title">기사 제목입니다.</div>
        <div className="magazine-detail-header-date">2024.10.07</div>
      </div>
      <img src={image} alt="" className="magazine-detail-img" />
      <div className="magazine-detail-content">
        현대 경제 활동의 한 축을 이루는 공유 경제는 개인 간에 자산, 서비스,
        시간을 인터넷 플랫폼을 통해 공유하는 것을 말합니다. Airbnb, Uber, 자전거
        공유 서비스 등이 이 경제 모델의 대표적인 예로, 경제적 효율성을
        증대시키면서도 전통적 비즈니스 모델을 재편하고 다양한 법적 과제를 낳고
        있습니다. 현대 경제 활동의 한 축을 이루는 공유 경제는 개인 간에 자산,
        서비스, 시간을 인터넷 플랫폼을 통해 공유하는 것을 말합니다. Airbnb,
        Uber, 자전거 공유 서비스 등이 이 경제 모델의 대표적인 예로, 경제적
        효율성을 증대시키면서도 전통적 비즈니스 모델을 재편하고 다양한 법적
        과제를 낳고 있습니다. 현대 경제 활동의 한 축을 이루는 공유 경제는 개인
        간에 자산, 서비스, 시간을 인터넷 플랫폼을 통해 공유하는 것을 말합니다.
        Airbnb, Uber, 자전거 공유 서비스 등이 이 경제 모델의 대표적인 예로,
        경제적 효율성을 증대시키면서도 전통적 비즈니스 모델을 재편하고 다양한
        법적 과제를 낳고 있습니다.
      </div>
      <button className="magazine-detail-like-button">개추 button</button>
    </div>
  );
}

export default MagazineDetail;
