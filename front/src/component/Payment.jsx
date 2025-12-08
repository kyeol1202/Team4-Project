import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";



function Payment(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const {items, total} = state ||{};

    const [sameAsUser, setSameAsUser] = useState(false);

    // 회원 정보 저장된 값 불러오기
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: ""
  });

  // 체크 시 자동 반영
    useEffect(() => {
    if (sameAsUser && storedUser) {
      setUserInfo(storedUser);
    }
  }, [sameAsUser]);

  const [payment, setPayment] = useState("");

    const handlePay = () => {
        if (!Payment) return alert("결제 수단을 선택해주세요.");
        alert("결제가 완료되었습니다.");
        navigate("/complete");
    };


    return(

        <div style={{maxWidth:"700px", margin:"0 auto", padding:"20px"}}>

            <h1>결제 페이지</h1>

            <h2>🧾 선택 상품</h2>
            <ul>
                {items ?.map(item =>(
                    <li key={item.id}>
                         {item.name} - {item.qty}개 - {(item.price * item.qty).toLocaleString()}원
                    </li>
                ))}
            </ul>
             <h2>💳 회원 정보</h2>

        {/* ✔ 회원정보 자동 불러오기 체크 */}
      <label style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
        <input
          type="checkbox"
          checked={sameAsUser}
          onChange={() => setSameAsUser(!sameAsUser)}
        />
        회원정보와 동일
      </label>

      <input disabled={sameAsUser} placeholder="이름" value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
        <br/>
        <input disabled={sameAsUser} placeholder="전화번호" value={userInfo.phone}
        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />
        <br/>
        <input disabled={sameAsUser} placeholder="이메일" value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
        <br/>

        <h2>📦 배송지</h2>

        <input disabled={sameAsUser} placeholder="도로명 주소" value={userInfo.address}
        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
        <br/>
        <input disabled={sameAsUser} placeholder="상세 주소" value={userInfo.detailAddress}
        onChange={(e) => setUserInfo({ ...userInfo, detailAddress: e.target.value })} />
        <br/>
        <h2>💰 결제 수단</h2>
        <label><input type="radio" name="pay" onChange={() => setPayment("kakao")} /> 카카오페이</label><br/>
        <label><input type="radio" name="pay" onChange={() => setPayment("naver")} /> 네이버페이</label><br/>
        <label><input type="radio" name="pay" onChange={()=>setPayment("card")}/>카드결제</label><br/>
        <label><input type="radio" name="pay" onChange={()=>setPayment("bank")}/>무통장입금</label><br/>
       
        <h2>총 결제 금액: {total?.toLocaleString()}원</h2>

      <button onClick={handlePay}>결제하기</button>
      <button onClick={() => navigate("/cart")}>장바구니로 돌아가기</button>
    </div>
  );
}

export default Payment;