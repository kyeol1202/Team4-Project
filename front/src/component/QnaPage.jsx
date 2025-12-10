import React,{useState} from "react";

function QnaPage(){
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
        setForm((prev) => ({...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("문의 내용 제출 :", form);
        alert("문의가 제출되었습니다.");
        // 여기에 제출 로직 추가 (예: API 호출)
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
        <div className="bg-white text-black min-h-screen px-8 py-14 max-w-4xl mx-auto font-[Cormorant]">
            {/*타이틀*/}
            <h1 className="text-4xl font-bold text-center mb-2 tracking-wider">고객센터</h1>
            <h2 className="text-2xl text-center mb-10 fon-semibold">**문의 하기**</h2>

            {/*연락 정보*/}
            <section className="mb-10 border-b border-gray-300 pb-6">
                <h3 className="text-xl font-semibold mb-4">연락 정보</h3>
               <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        name="usrId"
                        value={form.usrId}
                        onChange={handleChange}
                        placeholder="아이디"
                        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-64"/>
                        <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일"
                        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-64"/>
                        <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="휴대폰 번호"
                        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-64"/>
                </div>
                <button
                    onClick={kakaoChat}
                    className="bg-yellow-400 text-white px-6 py-3 rounded-md hover:bg-yellow-500 transition w-full md:w-auto">
                    카카오톡 문의하기
                </button>        
                </div>
            </section>

            {/*문의 유형*/}
            <section className="mb-10">
                <h3 className="text-xl font-semibold mb-4">문의 유형</h3>
                <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="inquiryType"
                            value="제품 문의"
                            checked={form.inquiryType === "제품 문의"}
                            onChange={handleChange}
                            className="accent-black"/>
                        <span>제품 문의</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="inquiryType"
                            value="주문/결제 문의"
                            checked={form.inquiryType === "주문/결제 문의"}
                            onChange={handleChange}
                            className="accent-black"/>
                        <span>주문/결제 문의</span>
                    </label>
                    <div className="flex flex-col space-y-2 pl-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="inquiryType"
                                value="교환/반품 문의"
                                checked={form.inquiryType === "교환/반품 문의"}
                                onChange={handleChange}
                                className="accent-black"/>
                            <span>교환/반품 문의</span>
                        </label>
                        <div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0">
                            <input
                                type="text"
                                name="prodctNumber"
                                value={form.prodctNumber}
                                onChange={handleChange}
                                placeholder="제품 번호"
                                className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-48"/>
                            <input
                                type="text"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                placeholder="제품명"
                                className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-48"/>   
                        </div>
                </div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="inquiryType"
                            value="기타 문의"
                            checked={form.inquiryType === "기타 문의"}  
                            onChange={handleChange}
                            className="accent-black"/>
                        <span>기타 문의</span>
                    </label>
                </div>
            </section>

            {/*문의 내용*/}
            <section className="mb-10">
                <h3 className="text-xl font-semibold mb-4">문의 내용</h3>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="문의 내용을 작성해주세요."
                    className="border border-gray-300 px-4 py-2 rounded-md w-full h-40 resize-none"/>
            </section>

            {/*제출 버튼*/}
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition">
                    문의 제출
                </button>
            </div>
        </div>
    );
}
export default QnaPage;

        