import React, { useState, useEffect } from "react";
import Switch from "./Switch";
import SendIcon from "../../assets/search/searchsend.png";
import fastaxiosInstance from "../../utils/fastaxiosInstance";
import axiosInstance from "../../utils/axiosInstance";
import CaseModal from "./CaseModal"; // CaseModal 컴포넌트 가져오기
import "./AiSearch.css";

function AiSearch({ isAiMode, onToggle }) {
  const [sessionId, setSessionId] = useState(null); // session ID 상태
  const [messages, setMessages] = useState([
    { type: "ai", content: "안녕하세요, 무엇을 도와드릴까요?" },
  ]);
  const [inputValue, setInputValue] = useState(""); // 입력값 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedCaseId, setSelectedCaseId] = useState(null); // 선택된 caseInfoId 저장
  const [judgmentSummary, setJudgmentSummary] = useState(""); // 판결 요약 데이터 저장

  // 세션 ID 가져오기 (컴포넌트 마운트 시)
  useEffect(() => {
    const fetchSessionId = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axiosInstance.get(
          "/fastapi_ec2/chat/case_search/new",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );
        setSessionId(response.data.session_id); // 세션 ID 설정
      } catch (error) {
        console.error("Session ID 요청 실패", error);
      }
    };

    fetchSessionId();
  }, []);

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
      const token = localStorage.getItem("token");

      // GPT에게 요청 보내기
      const response = await axiosInstance.post(
        "/fastapi_ec2/chat/case_search",
        {
          input_data: inputValue,
          session_id: sessionId,
<<<<<<< HEAD
=======
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the authorization header
            accept: "application/json",
          }
>>>>>>> master
        }
      );

      const aiResponse = response.data;

      // GPT 응답 추가 (순서대로 나옴)
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];

        if (aiResponse.tool_message) {
          newMessages.push({
            type: "ai",
            content: (
              <div>
                유사한 판례는 다음과 같습니다!:
                {aiResponse.tool_message.artifact.map((artifactId) => (
                  <button
                    key={artifactId}
                    onClick={() => openModal(artifactId)}
                    style={{
                      display: "block",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    판례 {artifactId} 상세 보기
                  </button>
                ))}
              </div>
            ),
          });

          // tool_message.content를 메시지로 추가
          newMessages.push({
            type: "ai",
            content: aiResponse.tool_message.content,
          });

          // ai_message.content를 메시지로 추가
          newMessages.push({
            type: "ai",
            content: aiResponse.ai_message.content,
          });
        } else if (aiResponse.ai_message) {
          newMessages.push({
            type: "ai",
            content: aiResponse.ai_message.content,
          });
        }

        return newMessages;
      });
    } catch (error) {
      console.error("GPT 응답 실패", error);
    }
  };

  // 모달 열기
  const openModal = async (caseId) => {
    setSelectedCaseId(caseId);
    try {
      // 판례 상세 정보를 Axios로 가져오기
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/spring_api/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJudgmentSummary(response.data.judgmentSummary); // judgmentSummary 데이터 저장
      setIsModalOpen(true);
    } catch (error) {
      console.error("판례 상세 조회 실패", error);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCaseId(null);
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

      {isModalOpen && (
        <CaseModal
          judgmentSummary={judgmentSummary}
          closeModal={closeModal}
          artifact={selectedCaseId} // artifact 전달
        />
      )}

      <div className="search-input-box">
        <input
          type="text"
          style={{ marginLeft: "20px" }}
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <img
          src={SendIcon}
          alt="search send"
          className="search-send"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default AiSearch;
