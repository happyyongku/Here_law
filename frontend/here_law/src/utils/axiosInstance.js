import axios from "axios";

// const API_LINK = import.meta.env.VITE_API_URL;
// const SWAGGER_LINK = import.meta.env.SWWAGER_API_URL;

const axiosInstance = axios.create({
  baseURL: "https://j11b109.p.ssafy.io",
  withCredentials: true,
});

export default axiosInstance;

// // 사용할 때는 이런식으로 한다.
// const fetchUserList = async () => {
//   try {
//     const response = await axiosInstance.get("/users"); // 다른 경로
//     // 처리 로직
//   } catch (err) {
//     // 오류 처리
//   }
// };

// ##########################
// 로컬스토리지로 토큰 관리하는 방식
// ##########################

// import axios from "axios";

// const API_LINK = import.meta.env.VITE_API_URL;

// // Axios 인스턴스 생성
// const axiosInstance = axios.create({
//   baseURL: API_LINK,
//   withCredentials: true, // 쿠키와 함께 요청할 경우
// });

// // 요청 인터셉터 설정
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스 토큰 가져오기
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`; // 토큰을 헤더에 추가
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 설정
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // 403 오류가 발생하면
//     if (error.response && error.response.status === 403) {
//       // 여기서 새로운 토큰을 요청하는 로직을 추가할 수 있습니다
//       // 예: refreshToken을 사용하여 새로운 액세스 토큰을 얻는 것

//       // 예시: 새로운 토큰을 가져온 후
//       const newToken = await refreshAccessToken(); // 실제 구현 필요
//       if (newToken) {
//         localStorage.setItem("accessToken", newToken); // 새로운 토큰 저장
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest); // 원래 요청 재시도
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // 토큰 갱신 함수 (구현 필요)
// const refreshAccessToken = async () => {
//   try {
//     const response = await axios.post(`${API_LINK}/auth/refresh`, {}, { withCredentials: true });
//     return response.data.data.accessToken;
//   } catch (error) {
//     // 오류 처리
//     console.error("토큰 갱신 실패", error);
//     return null;
//   }
// };

// export default axiosInstance;
