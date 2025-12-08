import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-feather";

function Service() {
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
        <div className="bg-white text-black min-h-screen px-8 py-14 max-w-4xl mx-auto font-[Cormorant]">
           <h1 className="text-4xl font-bold text-center mb-14 tracking-wider">고객센터</h1> 
           
           {/*공지사항*/}
           <section className="mb-10 border-t border-b border-black py-6">
            <h3 className="text-xl font-semibold mb-4">공지사항</h3>
            <ul className="space-y-2 text-lg">
                <li onClick={()=>navigate("/notice/1")} className="cursor-pointer hover:opacity-60">▸ 설 연휴 배송 안내</li>
                <li className="cursor-pointer hover:opacity-60">▸ 향수 패키지 리뉴얼 공지</li>
                <li className="cursor-pointer hover:opacity-60">▸ 회원 등급별 혜택 안내</li>
            </ul>
              </section>
              
              {/*FAQ*/}
              <section className="mb-14">
                <h3 className="text-xl font-semibold mb-6">F A Q</h3>
                {faqData.map((item, index) => (
                    <div key={index} className="border-b border-gray-300 py-4 cursor-pointer" onClick={() => toggleFAQ(index)}>
                    <div className="flex justify-between">
                    <span className="text-lg">{item.question}</span>
                    {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {openIndex === index && <p className="mt-3 text-gray-600">{item.answer}</p>}
                    </div>
                ))}
              </section>

              {/*1:1 문의*/}
              <div className="text-center mb-10">
                <button onClick={()=>navigate("/qna")} className="bg-black text-white px-10 py-4 rounded-none hover:bg-gray-900 text-lg tracking-widest">
                   카톡 1:1 문의하기
                    </button>
                </div>
                {/*카카오톡 채널*/}
                <div className="fixed bottom-7 right-7 bg-[#FEE500] w-16 h-16 flex items-center justify-center rounded-full shadow-xl cursor-pointer hover:opacity-80" onClick={kakaoChat}>
                    <img src="https://developers.kakao.com/tool/resource/static/img/buttonbutton/channel/consult_small_yellow.png" alt="kakao" className="w-10" />
                    </div>
                     
                     {/*운영 안내*/}
                <footer className="text-center text-sm text-gray-500 mt-20">
                    <p>운영 시간: 평일 09:00~18:00 | 점심시간: 12:30~13:30 | 주말 및 공휴일 휴무</p>
                    <p className="mt-2">고객센터 전화: 1234-5678 </p>
                </footer>
        </div>
    );
}
export default Service;
