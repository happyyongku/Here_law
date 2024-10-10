import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./LawyerDetail.css";

function LawyerDetail({ isOpen, onClose, lawyerId }) {
  const [lawyerDetail, setLawyerDetail] = useState({});
  const mapContainerRef = useRef(null); // 지도 표시할 div를 참조하기 위한 useRef

  const getLawyerRec = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        `/fastapi_ec2/lawyer/lawyer/${lawyerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("변호사 상세 조회 성공", response.data);
      setLawyerDetail(response.data);
      const address =
        response.data.office_location &&
        response.data.office_location !== "somewhere"
          ? response.data.office_location
          : "서울특별시 중구 세종대로 110";
      loadMap(address);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 변호사 상세 조회 실패", error);
      }
    }
  };

  const loadMap = (address) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao map script not loaded");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;

        // 지도를 표시할 div와 좌표 설정
        const mapOption = {
          center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        // 지도 생성 및 표시
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
  };

  useEffect(() => {
    const checkKakaoScriptLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        console.log("Kakao map script loaded successfully.");
        getLawyerRec();
      } else {
        console.log("Kakao map script not loaded, retrying...");
        setTimeout(checkKakaoScriptLoaded, 100);
      }
    };

    if (isOpen) {
      checkKakaoScriptLoaded();
    }
  }, [lawyerId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <button className="modal-close2" onClick={onClose}>
          닫기
        </button>
        <div>이미지 대용zz</div>
        <div>
          <div>변호사명</div>
          <div>{lawyerDetail.nickname}</div>
        </div>
        <div>
          <div>전문분야</div>
          <div>{lawyerDetail.expertise_main}</div>
        </div>
        <div>
          <div>이메일</div>
          <div>{lawyerDetail.email}</div>
        </div>
        <div>
          <div>소개글</div>
          <div>{lawyerDetail.description}</div>
        </div>
        <div>
          <div>변호사 전화번호</div>
          <div>{lawyerDetail.user_phone}</div>
        </div>
        <div>
          <div>위치</div>
          <div>{lawyerDetail.office_location}</div>
          <div
            ref={mapContainerRef}
            style={{ width: "100%", height: "300px", marginTop: "20px" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LawyerDetail;
