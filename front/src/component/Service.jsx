// src/pages/Service.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQna } from "../context/QnaContext";

function Service() {
  const navigate = useNavigate();
  const { submissions, addAnswer } = useQna();
  const [openIndex, setOpenIndex] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const toggleOpen = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
    setAnswerText(submissions[idx]?.answer !== "답변 대기 중" ? submissions[idx]?.answer : "");
  };

  return (
    <div className="service-container">
      <h1 className="service-title">고객센터</h1>
      <p className="service-subtitle">궁금하신 사항을 확인하세요</p>

      {/* FAQ 예시 */}
      <section className="service-section">
        <h3 className="service-section-title">📌 F A Q</h3>
        <div>FAQ 내용은 여기에 추가</div>
      </section>

      {/* 제출된 문의 게시판 */}
      {submissions.length > 0 && (
        <section className="service-section">
          <h3 className="service-section-title">제출된 문의</h3>
          {submissions.map((item, idx) => (
            <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', cursor: 'pointer' }} onClick={() => toggleOpen(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.id}. {item.inquiryType}</span>
                <span>{openIndex === idx ? '▲' : '▼'}</span>
              </div>
              {openIndex === idx && (
                <div style={{ marginTop: '8px' }}>
                  <p><strong>내용:</strong> {item.content}</p>
                  <p><strong>답변:</strong> {item.answer}</p>

                  {/* 답변 작성 (관리자용) */}
                  <div style={{ marginTop: '8px' }}>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="답변 작성..."
                      style={{ width: '100%', minHeight: '60px', padding: '6px' }}
                    />
                    <button
                      style={{ marginTop: '6px', padding: '6px 12px', cursor: 'pointer' }}
                      onClick={() => {
                        addAnswer(item.id, answerText);
                        alert("답변 등록 완료!");
                        setAnswerText("");
                      }}
                    >
                      답변 등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 1:1 문의 버튼 */}
      <section className="service-section">
        <button onClick={() => navigate("/qna")}>1:1 문의하기</button>
      </section>
    </div>
  );
}

export default Service;

