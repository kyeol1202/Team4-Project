import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-feather";

function ServicePage() {
  const navigate = useNavigate();

  // FAQ 데이터
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const faqData = [
    { question: "배송 기간은 어떻게 되나요?", answer: "평균 배송 기간은 주문 후 3~5일 내 도착합니다." },
    { question: "교환/반품 신청은 어떻게 하나요?", answer: "마이페이지 > 주문 내역에서 접수 가능합니다." },
    { question: "운영 시간 안내", answer: "평일 09:00~18:00 / 점심 12:30~13:30 / 주말·공휴일 휴무" },
  ];

  // 문의 게시판 데이터
  const [questions, setQuestions] = useState([]);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    setQuestions(storedQuestions);
  }, []);

  const toggleFaq = (idx) => setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  const toggleQuestion = (idx) => setOpenQuestionIndex(openQuestionIndex === idx ? null : idx);

  const handleKakaoChat = () => {
    const url = "https://pf.kakao.com/카카오채널ID/chat";
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="service-container">
      <h1 className="service-title">고객센터</h1>
      <p className="service-subtitle">궁금하신 사항을 확인하세요</p>

      {/* FAQ */}
      <section className="service-section">
        <h3 className="service-section-title">📌 FAQ</h3>
        {faqData.map((item, idx) => (
          <div
            key={idx}
            className={`service-faq ${openFaqIndex === idx ? "open" : ""}`}
            onClick={() => toggleFaq(idx)}
          >
            <div className="service-faq-question">
              {item.question}
              {openFaqIndex === idx ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openFaqIndex === idx && (
              <p className="service-faq-answer">{item.answer}</p>
            )}
          </div>
        ))}
      </section>

      {/* 1:1 문의 버튼 + 카카오톡 */}
      <section className="service-section">
        <div className="service-qna-wrapper">
          <button className="service-qna-btn" onClick={() => navigate("/qna")}>
            1:1 문의하기
          </button>
          <button className="service-kakao-inline" onClick={handleKakaoChat}>
            <img
              src="https://developers.kakao.com/tool/resource/static/img/buttonbutton/channel/consult_small_yellow.png"
              alt="카카오톡 문의"
            />
          </button>
        </div>
      </section>

      {/* 문의 게시판 */}
      <section className="service-section">
        <h3 className="service-section-title">📌 내가 작성한 문의</h3>
        {questions.length === 0 ? (
          <p>작성한 문의가 없습니다.</p>
        ) : (
          <div className="card-list">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="card-item"
                style={{ cursor: "pointer" }}
                onClick={() => toggleQuestion(idx)}
              >
                <p><strong>{idx + 1}번 문의:</strong> {q.inquiryType}</p>
                {openQuestionIndex === idx && (
                  <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
                    <p><strong>문의 내용:</strong> {q.question}</p>
                    <p><strong>답변:</strong> {q.answer || "답변 대기중"}</p>
                    <p><small>작성일: {new Date(q.createdAt).toLocaleString()}</small></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="service-footer">
        <p>운영 시간: 평일 09:00~18:00 | 점심 12:30~13:30 | 주말·공휴일 휴무</p>
        <p>고객센터: 1234-5678</p>
      </footer>
    </div>
  );
}

export default ServicePage;

