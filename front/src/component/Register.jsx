import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // 현재 화면 모드 (null=초기)
  const [mode, setMode] = useState(null);   // "USER" or "ADMIN"

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number1] = useState("010");
  const [number2, setNumber2] = useState("");
  const [number3, setNumber3] = useState("");
  const [hbd, setHbd] = useState({ year: "", month: "", day: "" });

  const number3Ref = useRef(null);

  // ============================
  // 회원가입 함수
  // ============================
  async function register() {

    const fullNumber = `${number1}${number2}${number3}`;
    if (!id || !pw || !name || !email || !address || !number2 || !number3
      || !hbd.year || !hbd.month || !hbd.day) {
      alert("필수항목을 입력해주세요");
      return;
    }

    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    const birth = `${hbd.year}-${String(hbd.month).padStart(2, '0')}-${String(hbd.day).padStart(2, '0')}`;

    const userData = {
      id,
      pw,
      name,
      email,
      address,
      number: fullNumber,
      hbd: birth,
      role: mode     // 🔥 USER or ADMIN 전달
    };

    const response = await fetch("http://192.168.0.224:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (result.success) {
      alert("🎉 회원가입 성공!");
      navigate('/main');
    } else {
      alert("❌ 회원가입 실패: " + result.message);
    }
  }

  return (
    <>

      {/* ==============================
          🔥 첫 화면 (계정 유형 선택)
      =============================== */}
      {mode === null && (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <h2>회원가입 유형 선택</h2>
          <button 
            style={{ width:"200px", padding:"12px", margin:"10px" }}
            onClick={() => setMode("USER")}
          >
            일반 회원가입
          </button>

          <button 
            style={{ width:"200px", padding:"12px", margin:"10px" }}
            onClick={() => setMode("ADMIN")}
          >
            사업자 회원가입
          </button>

          <button onClick={() => navigate("/")}>🏡 홈</button>
        </div>
      )}


      {/* ====================================
          🔥 회원가입 폼 (둘 중 하나 선택 후)
      ===================================== */}
      {mode !== null && (
        <>
          <h2>{mode === "USER" ? "일반 회원가입" : "사업자 회원가입"}</h2>

          <div>아이디</div>
          <input value={id} onChange={(e) => setId(e.target.value)} />

          <div>비밀번호</div>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />

          <div>비밀번호 확인</div>
          <input type="password" value={pwCheck} onChange={(e) => setPwCheck(e.target.value)} />

          <div>성함</div>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <div>이메일</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <div>주소</div>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />

          <div>전화번호</div>
          <div>
            <input readOnly value={number1} style={{ width:"60px" }} />
            -
            <input
              value={number2}
              maxLength={4}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setNumber2(val);
                if (val.length === 4) number3Ref.current?.focus();
              }}
              style={{ width:"80px" }}
            />
            -
            <input
              ref={number3Ref}
              value={number3}
              onChange={(e) => setNumber3(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={4}
              style={{ width:"80px" }}
            />
          </div>

          <div>생년월일</div>
          <select value={hbd.year} onChange={(e) => setHbd({ ...hbd, year: e.target.value })}>
            <option value="">년도</option>
            {Array.from({ length: 120 }, (_, i) => 2025 - i).map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>

          <select value={hbd.month} onChange={(e) => setHbd({ ...hbd, month: e.target.value })}>
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>

          <select value={hbd.day} onChange={(e) => setHbd({ ...hbd, day: e.target.value })}>
            <option value="">일</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>

          <br /><br />
          <button onClick={register}>회원가입</button>

          <button onClick={() => setMode(null)}>← 계정 유형 다시 선택</button>

        </>
      )}
    </>
  );
}

export default Register;
