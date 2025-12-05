import { useState , useRef } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [idChecked, setIdChecked] = useState(false);
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [number1] = useState("010");
    const [number2, setNumber2] = useState("");
    const [number3, setNumber3] = useState("");
    const [hbd, setHbd] = useState(''); //hbd >> 생년월일
    
    //아이디중복확인
    const checkDuplicateId = async () => {
    if (!id) {
        alert("아이디를 입력해주세요!");
        return;
    }

    const res = await fetch("http://localhost:4000/api/check-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.exists) {
        alert("이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
    } else {
        alert("사용 가능한 아이디입니다!");
        setIsIdChecked(true);
    }
};
    const number3Ref = useRef(null);

    function register() {

        const fullNumber = `${number1}${number2}${number3}`;
        if (!id || !pw || !name || !email || !address || !number2 || !number3 || !hbd) { //필수항목이 비어있을 때
            alert("필수항목을 입력해주세요");
            return;
        }
        if (!isIdChecked) {
        alert("아이디 중복확인을 해주세요!");
        return;
        }
        if (pw !== pwCheck) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }

        //LocalStorage에 저장
        localStorage.setItem('id', id);
        localStorage.setItem('pw', pw);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('address', address);
        localStorage.setItem('number', fullNumber);
        localStorage.setItem('hbd', hbd);

        alert("회원가입 완료")

        //회원가입 후 메인페이지로 이동
        navigate('/main');
    }


    //회원가입
    return (
        <>
            <h2>회원가입</h2>

            <div>
                <div>아이디</div>
                <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                <button onClick={checkDuplicateId}>중복확인</button>
                </div>
            </div>
            <div>
                <div>비밀번호</div>
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <div>
                <div>비밀번호 확인</div>
                <input type="password" value={pwCheck} onChange={(e) => setPwCheck(e.target.value)} />
            </div>
            <div>
                <div>성함</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <div>이메일</div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <div>주소</div>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div>
                <div>전화번호</div>
                <div style={{ display: "flex", gap: "5px" }}>
                    <input
                        type="text"
                        value={number1}
                        readOnly
                        style={{ width: "60px", textAlign: "center" }}
                    />
                    <span>-</span>

                    
                    <input
                        type="text"
                        value={number2}
                         maxLength={4}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setNumber2(val);

                            if (val.length === 4) {
                                number3Ref.current?.focus();
                            }
                        }}
                        style={{ width: "80px", textAlign: "center" }}
                    />
                    <span>-</span>

                    <input
                        type="text"
                        value={number3}
                        ref={number3Ref}
                        onChange={(e)=>setNumber3(e.target.value.replace(/[^0-9]/g,''))}
                        maxLength={4}
                        style={{ width: "80px", textAlign: "center" }}
                    />
                </div>

                <div>
                    <div>생년월일</div>
    <div style={{ display: "flex", gap: "10px" }}>
        {/* 연도 */}
        <select
            value={hbd.year}
            onChange={(e) => setHbd({ ...hbd, year: e.target.value })}
        >
            <option value="">년도</option>
            {Array.from({ length: 120 }, (_, i) => 2025 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
            ))}
        </select>

        {/* 월 */}
        <select
            value={hbd.month}
            onChange={(e) => setHbd({ ...hbd, month: e.target.value })}
        >
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>{month}</option>
            ))}
        </select>

        {/* 일 */}
        <select
            value={hbd.day}
            onChange={(e) => setHbd({ ...hbd, day: e.target.value })}
        >
            <option value="">일</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>{day}</option>
            ))}
        </select>
    </div>
                </div>
                <button onClick={() => navigate("/")}>🏡</button>
                <button onClick={register}>회원가입</button>
            </div>
            </>
            )
}


            export default Register;