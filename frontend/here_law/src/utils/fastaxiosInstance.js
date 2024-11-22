import axios from "axios";

const fastaxiosInstance = axios.create({
  baseURL: "https://j11b109.p.ssafy.io", // FastAPI 서버의 baseURL 설정
  withCredentials: true, // 필요한 경우 쿠키를 함께 전송할 수 있도록 설정
});

export default fastaxiosInstance;
