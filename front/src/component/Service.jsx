import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-feather";
import "./Service.css"; // 아래 CSS 파일 import

function Service() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { question: "배송 기간은 어떻게 되나요?", answer: "평균 배송 기간은 주문 후 3-5일 이내입니다. 특정 지역이나 상황에 따라 다를 수 있습니다." },
    { question: "교환/반품 접수 방법은?", answer: "마이페이지 > 주문내역에서 교환/반품 신청이 가능합니다." },
    { question: "고객센터 운영 시간 안내", answer: "평일 09:00~18:00 / 점심시간: 12:30~13:30 / 주말 및 공휴일 휴무" },
  ];

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const kakaoChat = () => {
    const url = "https://pf.kakao.com/당신카카오채널ID/chat"; // 실제 채널 ID로 교체
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = url; // 모바일
    } else {
      window.open(url, "_blank"); // PC
    }
  };

  return (
    <div className="service-page">
      <h1 className="service-title">고객센터</h1>

      {/* 공지사항 */}
      <section className="service-section">
        <h3>공지사항</h3>
        <ul className="notice-list">
          <li onClick={() => navigate("/notice/1")}>▸ 설 연휴 배송 안내</li>
          <li>▸ 향수 패키지 리뉴얼 공지</li>
          <li>▸ 회원 등급별 혜택 안내</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="service-section">
        <h3>F A Q</h3>
        {faqData.map((item, index) => (
          <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              <span>{item.question}</span>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openIndex === index && <p className="faq-answer">{item.answer}</p>}
          </div>
        ))}
      </section>

      {/* 1:1 문의 */}
      <div className="qna-wrapper">
        <button className="qna-btn" onClick={() => navigate("/qna")}>1:1 문의하기</button>
      </div>

      {/* 카카오톡 문의 버튼 (오른쪽 중간) */}
      <div className="kakao-mid-btn" onClick={kakaoChat}>
        <img
          src="https://developers.kakao.com/tool/resource/static/img/buttonbutton/channel/consult_small_yellow.png"
          alt="카카오톡 문의"
        />
      </div>

      {/* 운영 안내 */}
      <footer className="service-footer">
        <p>운영 시간: 평일 09:00~18:00 | 점심시간: 12:30~13:30 | 주말 및 공휴일 휴무</p>
        <p>고객센터 전화: 1234-5678</p>
      </footer>
    </div>
  );
}

export default Service;
