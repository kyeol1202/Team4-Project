import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function QnaPage() {
    const navigate = useNavigate();
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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newQuestion = {
            id: Date.now(),
            question: form.content,
            answer: "",
            usrId: form.usrId,
            email: form.email,
            phone: form.phone,
            inquiryType: form.inquiryType,
            productNumber: form.prodctNumber,
            productName: form.productName,
            createdAt: new Date().toISOString(),
        };

        const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        const updatedQuestions = [newQuestion, ...storedQuestions];
        localStorage.setItem("questions", JSON.stringify(updatedQuestions));

        alert("문의가 제출되었습니다.");
        navigate("/mypage"); // 제출 후 마이페이지(문의 확인)로 이동
    };

    const kakaoChat = () => {
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

            {/* 문의 유형 (셀렉트 박스/드롭다운) */}
<section className="service-section">
    <h3 className="service-section-title">문의 유형</h3>
    <div className="qna-contact">
        <select 
            name="inquiryType" 
            value={form.inquiryType} 
            onChange={handleChange}
            // CSS 스타일링을 위한 클래스 추가
            className="inquiry-type-select" 
        >
            {/* 첫 번째 옵션은 보통 안내 문구로 사용하며, 실제 값은 공백으로 둡니다. */}
            <option value="">-- 문의 유형을 선택해 주세요 --</option>
            
            {/* 사용자가 선택할 수 있는 실제 옵션들 */}
            <option value="제품 문의">제품 문의</option>
            <option value="주문/결제 문의">주문/결제 문의</option>
            <option value="교환/반품 문의">교환/반품 문의</option>
            <option value="기타 문의">기타 문의</option>
        </select>
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
