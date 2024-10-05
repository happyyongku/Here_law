import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatApp = () => {
  const [userInput, setUserInput] = useState(""); // 사용자의 입력
  const [sessionId, setSessionId] = useState(null); // 세션 ID 저장
  const [messages, setMessages] = useState([]); // 메시지 목록 저장

  // 세션 생성 요청
  const createSession = async () => {
    try {
      const response = await axios.post("/fastapi_ec2/chat/case_search/new");
      const { session_id } = response.data;
      setSessionId(session_id); // 세 션 ID 저장
      console.log("세션 생성 성공:", session_id);
    } catch (error) {
      console.error("세션 생성 실패:", error);
    }
  };

  // 첫 로드 시 세션 ID 가져오기
  useEffect(() => {
    createSession();
  }, []);

  // 사용자가 입력한 메시지 API로 전송하고 답장 받기
  const sendMessage = async () => {
    if (!userInput || !sessionId) return; // 입력이나 세션 ID가 없을 경우 반환

    // 사용자의 메시지 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput },
    ]);

    try {
      const response = await axios.post("/fastapi_ec2/chat/case_search", {
        input_data: userInput,
        session_id: sessionId,
      });

      // AI 답장 메시지 추가
      const aiReply = response.data.reply; // AI로부터 받은 답변
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiReply },
      ]);

      // 입력창 비우기
      setUserInput("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  return (
    <div className="chat-app">
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "user" ? "user-message" : "ai-message"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
