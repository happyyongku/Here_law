import axiosInstance from "../../../utils/axiosInstance";

function LawyerDetail() {
  const getLawyerRec = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get(
        //   `/fastapi_ec2/lawyer/lawyer/${}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("변호사 상세 조회 성공", response.data);
      // setRecedLawyer(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        console.error("Error fetching user data, 변호사 상세 조회 실패", error);
      }
    } finally {
      // setLoading(false);
      // 데이터 요청 후 로딩 상태 업데이트
    }
  };
  return (
    <div>
      <div>변호사 상세</div>
    </div>
  );
}

export default LawyerDetail;
