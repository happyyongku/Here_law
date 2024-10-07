import axios from "axios";

const fastaxiosInstance = axios.create({
  baseURL: "https://3.36.85.129:8000", // FastAPI 서버의 baseURL 설정
  withCredentials: true, // 필요한 경우 쿠키를 함께 전송할 수 있도록 설정
});

export default fastaxiosInstance;
