// src/pages/QnaPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQna } from "../context/QnaContext";

function QnaPage() {
    const navigate = useNavigate();
    const { addSubmission } = useQna();
    const [form, setForm] = useState({
        usrId: "",
        email: "",
        phone: "",
        inquiryType: "",
        prodctNumber: "",
        productName: "",
        content: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubmission(form);
        alert("문의가 제출되었습니다.");
        navigate("/service"); // 제출 후 고객센터 페이지로 이동
    };

    const kakaoChat = () => {
        const url = "https://pf.kakao.com/카카오채널ID/chat";
        if(/Android|iPhone/i.test(navigator.userAgent)){
            window.location.href = url;
        } else {
            window.open(url, "_blank");
        }
    };

    return (
        <div className="service-container">
            <h1 className="service-title">고객센터</h1>
            <h2 className="service-subtitle">문의 하기</h2>

            {/* 연락 정보 */}
            <section className="service-section">
                <h3 className="service-section-title">연락 정보</h3>
                <div className="qna-contact">
                    <input type="text" name="usrId" value={form.usrId} onChange={handleChange} placeholder="아이디" className="qna-input" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="이메일" className="qna-input" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="휴대폰 번호" className="qna-input" />
                </div>
                <button className="service-kakao-inline" onClick={kakaoChat}>
                    <img src="https://developers.kakao.com/tool/resource/static/img/buttonbutton/channel/consult_small_yellow.png" alt="카카오톡 문의" />
                </button>
            </section>

            {/* 문의 유형 */}
            <section className="service-section">
                <h3 className="service-section-title">문의 유형</h3>
                <div className="qna-contact">
                    <label><input type="radio" name="inquiryType" value="제품 문의" checked={form.inquiryType==="제품 문의"} onChange={handleChange} /> 제품 문의</label>
                    <label><input type="radio" name="inquiryType" value="주문/결제 문의" checked={form.inquiryType==="주문/결제 문의"} onChange={handleChange} /> 주문/결제 문의</label>
                    <label><input type="radio" name="inquiryType" value="교환/반품 문의" checked={form.inquiryType==="교환/반품 문의"} onChange={handleChange} /> 교환/반품 문의</label>
                    <label><input type="radio" name="inquiryType" value="기타 문의" checked={form.inquiryType==="기타 문의"} onChange={handleChange} /> 기타 문의</label>
                </div>
            </section>

            {/* 문의 내용 */}
            <section className="service-section">
                <h3 className="service-section-title">문의 내용</h3>
                <textarea
                    className="qna-textarea"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="문의 내용을 작성해주세요."
                />
            </section>

            {/* 제출 버튼 */}
            <div style={{ textAlign: "center", marginTop: '20px' }}>
                <button className="qna-submit-btn" onClick={handleSubmit}>문의 제출</button>
            </div>
        </div>
    );
}

export default QnaPage;
