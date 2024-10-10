import { useEffect, useRef } from "react";
import "./LawyerLocation.css";

function LawyerLocation({ officeLocation }) {
  const mapContainerRef = useRef(null); // 지도 표시할 div 참조

  useEffect(() => {
    // 카카오 지도 API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao map script not loaded");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(officeLocation, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;

        // 지도 생성 및 표시
        const mapOption = {
          center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        const map = new window.kakao.maps.Map(
          mapContainerRef.current,
          mapOption
        );

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커를 지도에 표시
        marker.setMap(map);
      } else {
        console.error("Failed to load map. Address search failed.");
      }
    });
  }, [officeLocation]);

  return (
    <div className="lawyer-location-container">
      <div className="location-header">
        <h3 className="location-title">위치</h3>
        <div className="location-update">수정하기 &gt;</div>
      </div>
      <div className="location-detail">{officeLocation}</div>
      <div
        ref={mapContainerRef}
        className="location-map"
        style={{ width: "100%", height: "200px", marginTop: "20px" }}
      ></div>
    </div>
  );
}

export default LawyerLocation;
