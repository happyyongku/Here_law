import Switch from "./Switch";
import SendIcon from "../../assets/search/searchsend.png";
import "./AiSearch.css";

function AiSearch({ isAiMode, onToggle }) {
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
          <div className="ai-message">안녕하세요, 무엇을 도와드릴까요?</div>
          <div className="user-message">
            판례를 검색하고
            싶어가나아린ㅇ마러민아러미ㅏ얼미ㅏㄴ어림ㄴ아러ㅣㅁ낭러미나얼미ㅏㄴ어리만어리만어리ㅏ먼이라먼이ㅏ럼ㄴ이ㅏ러민아러ㅣㅁㅇ나ㅓ리ㅏㄴㄴ요.
          </div>
          <div className="user-message">
            판례를 검색하고
            싶어가나아린ㅇ마러민아러미ㅏ얼미ㅏㄴ어림ㄴ아러ㅣㅁ낭러미나얼미ㅏㄴ어리만어리만어리ㅏ먼이라먼이ㅏ럼ㄴ이ㅏ러민아러ㅣㅁㅇ나ㅓ리ㅏㄴㄴ요.
          </div>
          <div className="user-message">
            판례를 검색하고
            싶어가나아린ㅇ마러민아러미ㅏ얼미ㅏㄴ어림ㄴ아러ㅣㅁ낭러미나얼미ㅏㄴ어리만어리만어리ㅏ먼이라먼이ㅏ럼ㄴ이ㅏ러민아러ㅣㅁㅇ나ㅓ리ㅏㄴㄴ요.
          </div>
        </div>

        {/* 이하 메시지 어쩌구 */}
      </div>

      <div className="search-input-box">
        <input
          type="text"
          style={{ marginLeft: "20px" }}
          placeholder="메시지를 입력하세요"
        />
        <img src={SendIcon} alt="search send" className="search-send" />
      </div>
    </div>
  );
}

export default AiSearch;
