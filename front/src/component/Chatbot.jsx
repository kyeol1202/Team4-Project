import { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "안녕하세요! 무엇을 도와드릴까요? 😊" }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    // 화면에 사용자 메시지 먼저 표시
    const newUserMsg = { from: "user", text: input };
    setMessages(prev => [...prev, newUserMsg]);

    const sendText = input;
    setInput("");

    try {
  const res = await fetch("http://192.168.0.224:8080/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: sendText,
      userId: localStorage.getItem("member_id")   // user_id → userId !!
    })
  });

  const data = await res.json();
  const botText = data.reply || "서버 응답 오류 😢";

  setMessages(prev => [...prev, { from: "bot", text: botText }]);

} catch (err) {
  setMessages(prev => [
    ...prev,
    { from: "bot", text: "서버와 연결할 수 없습니다 😢" }
  ]);
}}


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "10px",
      background: "white"
    }}>

      {/* 메시지 표시 영역 */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              background: msg.from === "user" ? "#c9b6ff" : "#f1f1f1",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              fontSize: "14px"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div style={{
        display: "flex",
        gap: "5px",
        marginTop: "8px"
      }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#a78bfa",
            color: "white",
            cursor: "pointer"
          }}
        >
          전송
        </button>
      </div>

    </div>
  );
}

export default Chatbot;
