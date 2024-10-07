import axios from "axios";

const fastaxiosInstance = axios.create({
  baseURL: "http://192.168.31.229:8000",
  withCredentials: true,
});

export default fastaxiosInstance;
