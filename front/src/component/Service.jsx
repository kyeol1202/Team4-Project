import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-feather";

function Service() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { question: "배송 기간은 어떻게 되나요?", answer: "평균 배송 기간은 주문 후 3~5일 내 도착합니다." },
    { question: "교환/반품 신청은 어떻게 하나요?", answer: "마이페이지 > 주문 내역에서 접수 가능합니다." },
    { question: "운영 시간 안내", answer: "평일 09:00~18:00 / 점심 12:30~13:30 / 주말·공휴일 휴무" },
  ];

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const kakaoChat = () => {
    const url = "https://pf.kakao.com/당신채널ID/chat";
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

      {/* 공지사항 */}
      <section className="service-section">
        <h3 className="service-section-title">📌 공지사항</h3>
        <ul className="service-list">
          <li className="service-list-item" onClick={() => navigate("/notice/1")}>▸ 설 연휴 배송 안내</li>
          <li className="service-list-item">▸ 향수 패키지 리뉴얼 공지</li>
          <li className="service-list-item">▸ 회원 등급별 혜택 안내</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="service-section">
        <h3 className="service-section-title">📌 F A Q</h3>
        {faqData.map((item, idx) => (
          <div
            key={idx}
            className={`service-faq ${openIndex === idx ? "open" : ""}`}
            onClick={() => toggleFAQ(idx)}
          >
            <div className="service-faq-question">
              {item.question}
              {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
            </div>
            <p className="service-faq-answer">{item.answer}</p>
          </div>
        ))}
      </section>

      {/* 1:1 문의 + 카톡 버튼 */}
      <section className="service-section">
        <div className="service-qna-wrapper">
          <button className="service-qna-btn" onClick={() => navigate("/qna")}>
            1:1 문의하기
          </button>
          <button className="service-kakao-inline" onClick={kakaoChat}>
            <img
              src="https://developers.kakao.com/tool/resource/static/img/buttonbutton/channel/consult_small_yellow.png"
              alt="카카오톡 문의"
            />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="service-footer">
        <p>운영 시간: 평일 09:00~18:00 | 점심 12:30~13:30 | 주말·공휴일 휴무</p>
        <p>고객센터: 1234-5678</p>
      </footer>

    </div>
  );
}

export default Service;
