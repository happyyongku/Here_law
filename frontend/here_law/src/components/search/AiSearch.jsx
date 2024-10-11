import React, { useState, useEffect, useRef } from "react";
import Switch from "./Switch";
import SendIcon from "../../assets/search/searchsend.png";
import axiosInstance from "../../utils/axiosInstance";
import CaseModal from "./CaseModal";
import "./AiSearch.css";
import Loader from "../search/Loader2"; // Loading component
import Lighticon from "../../assets/search/light.gif";

function AiSearch({ isAiMode, onToggle }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    { type: "ai", content: "안녕하세요, 무엇을 도와드릴까요?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [judgmentSummary, setJudgmentSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatBoxRef = useRef(null);

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
        setSessionId(response.data.session_id);
      } catch (error) {
        console.error("Session ID 요청 실패", error);
      }
    };

    fetchSessionId();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const addAiResponsesSequentially = (aiResponses) => {
    aiResponses.forEach((response, index) => {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", content: response },
        ]);
      }, index * 1000);
    });
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: inputValue },
    ]);

    setInputValue("");
    setIsLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/fastapi_ec2/chat/case_search",
        {
          input_data: inputValue,
          session_id: sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      const aiResponse = response.data;
      const aiMessages = [];

      if (aiResponse.tool_message) {
        aiMessages.push(
          <div key="tool-message">
            유사한 판례는 다음과 같습니다!:
            {aiResponse.tool_message.artifact.map((artifactId) => (
              <button
                key={artifactId}
                onClick={() => openModal(artifactId)}
                className="case-show-button"
              >
                <img
                  src={Lighticon}
                  alt="light-icon"
                  className="case-modal-light-icon"
                />
                판례 {artifactId}{" "}
                <span style={{ color: "#5D5D5D", fontSize: "13px" }}>
                  {" "}
                  Go! →
                </span>
              </button>
            ))}
          </div>
        );
        aiMessages.push(aiResponse.tool_message.content);
        aiMessages.push(aiResponse.ai_message.content);
      } else if (aiResponse.ai_message) {
        aiMessages.push(aiResponse.ai_message.content);
      }

      addAiResponsesSequentially(aiMessages);
    } catch (error) {
      console.error("GPT 응답 실패", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const openModal = async (caseId) => {
    setSelectedCaseId(caseId);
    setIsLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/spring_api/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJudgmentSummary(response.data.judgmentSummary);
      setIsModalOpen(true);
    } catch (error) {
      console.error("판례 상세 조회 실패", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCaseId(null);
  };

  return (
    <div className="ai-search-page">
      {isAiMode && (
        <>
          <div className="ai-chat-box" ref={chatBoxRef}>
            <div className="chat-message">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.type === "ai" ? "ai-message" : "user-message"
                  }
                >
                  {typeof message.content === "string" ? (
                    message.content.split("[doc_separater]").map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <>
                            <br />
                            <br />
                            {"◆"}
                          </>
                        )}
                        {part}
                      </React.Fragment>
                    ))
                  ) : (
                    message.content
                  )}
                </div>
              ))}
            </div>
          </div>

          {isModalOpen && (
            <CaseModal
              judgmentSummary={judgmentSummary}
              closeModal={closeModal}
              artifact={selectedCaseId}
            />
          )}

          <div className="search-input-box">
            {isLoading && (
              <div className="loader-overlay">
                <Loader /> {/* Display loader during loading */}
              </div>
            )}
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
        </>
      )}
    </div>
  );
}

export default AiSearch;
