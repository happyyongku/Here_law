import React, { useState, useEffect } from "react";
import Switch from "./Switch";
import SendIcon from "../../assets/search/searchsend.png";
import fastaxiosInstance from "../../utils/fastaxiosInstance";
import "./AiSearch.css";

function AiSearch({ isAiMode, onToggle }) {
  const [sessionId, setSessionId] = useState(null); // session ID 상태

  const [messages, setMessages] = useState([
    { type: "ai", content: "안녕하세요, 무엇을 도와드릴까요?" },
  ]);

  const [inputValue, setInputValue] = useState(""); // 입력값 상태

  console.log("강경민");
  console.log(sessionId);

  // 1. 세션 ID 가져오기 (컴포넌트 마운트 시)
  useEffect(() => {
    const fetchSessionId = async () => {
      const token = localStorage.getItem("token");
      console.log("토큰", token);
      try {
        const response = await fastaxiosInstance.get(
          "/fastapi_ec2/chat/case_search/new",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );
        setSessionId(response.data.session_id); // 세션 ID 설정
        console.log("Session ID: ", response.data.session_id);
      } catch (error) {
        console.log("실패 ㅠ");
        console.error("Session ID 요청 실패", error);
      }
    };

    fetchSessionId();
  }, []);

  console.log("불러옴");
  console.log(sessionId);

  // 메시지를 입력하고 전송하는 함수
  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    // 사용자 메시지 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: inputValue },
    ]);

    // 입력창 초기화
    setInputValue("");

    try {
      // GPT에게 요청 보내기
      const response = await fastaxiosInstance.post(
        "/fastapi_ec2/chat/case_search",
        {
          input_data: inputValue,
          session_id: sessionId,
        }
      );

      const aiResponse = response.data.ai_message.content;

      // GPT 응답 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", content: aiResponse },
      ]);
    } catch (error) {
      console.log("GPT 응답 실패", error);
    }
  };

  return (
    <div className="ai-search-page">
      <div className="search-title">
        키워드 또는 Ai 검색으로 <br /> 판례를 검색하세요
        <span style={{ color: "#ff5e00" }}>.</span>
      </div>

      <div className="toggle-wrap">
        <Switch onToggle={onToggle} isChecked={isAiMode} />
      </div>

      <div className="ai-chat-box">
        <div className="chat-message">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.type === "ai" ? "ai-message" : "user-message"}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>

      <div className="search-input-box">
        <input
          type="text"
          style={{ marginLeft: "20px" }}
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // 입력값 상태 관리
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage(); // 엔터키로 메시지 전송
          }}
        />
        <img
          src={SendIcon}
          alt="search send"
          className="search-send"
          onClick={sendMessage} // 클릭으로 메시지 전송
        />
      </div>
    </div>
  );
}

export default AiSearch;
