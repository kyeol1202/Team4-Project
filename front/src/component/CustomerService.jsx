import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {ChevronDown, ChevronUp} from "react-feather";

function CustomerService() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {question: "배송 기간은 어떻게 되나요?",
         answer: "평균 배송 기간은 주문 후 3-5일 이내입니다. 특정 지역이나 상황에 따라 다를 수 있습니다."},
        { question: "교환/반품 접수 방법은?", answer: "마이페이지 > 주문내역에서 교환/반품 신청이 가능합니다." },
        { question: "고객센터 운영 시간 안내", answer: "평일 09:00~18:00 / 점심시간 12:30~13:30 / 주말 및 공휴일 휴무" },
];


const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);


const kakaoChat = () => {
const url = "https://pf.kakao.com/당신카카오채널ID/chat";
if (/Android|iPhone/i.test(navigator.userAgent)) {
window.location.href = url;
} else {
window.open(url, "_blank");
}
};
    return (
        <div className="bg-white text-black min-h-screen px-8 py-14 max-w-4xl mx-auto font-[Cormorant]]">
            