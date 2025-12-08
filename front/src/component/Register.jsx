import { useState, useRef } from "react";
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
    const [hbd, setHbd] = useState({
        year: "",
        month: "",
        day: ""
    });

    const number3Ref = useRef(null);

    // ============================
    // 🔥 아이디 중복확인 함수 (제대로 위치)수정
    // ============================
    const IdChecked = async () => {
        if (!id) {
            alert("아이디를 입력해주세요!");
            return;
        }

        try {
            const response = await fetch("http://192.168.0.224:8080/api/check-id", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const res = await response.json();

<<<<<<< HEAD
            if (res.exists) {
                alert("중복된 아이디입니다.");
                setIdChecked(false);
            } else {
                alert("사용 가능한 아이디입니다.");
                setIdChecked(true);
            }
=======
            // if (res.exists) {
            //     alert("중복된 아이디입니다.");
            //     setIdChecked(false);
            // } else {
            //     alert("사용 가능한 아이디입니다.");
            //     setIdChecked(true);
            // }
>>>>>>> 4c8dcfd3f27d8d9c635cf4073e3846e20d843cd9
        } catch (error) {
            console.error("중복확인 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    // ============================
    // 🔥 회원가입 함수
    // ============================
<<<<<<< HEAD
    async function register() {
=======
    function register() {
>>>>>>> 4c8dcfd3f27d8d9c635cf4073e3846e20d843cd9
        const fullNumber = `${number1}${number2}${number3}`;

        // 필수항목 체크 (생년월일 제대로 확인)
        if (!id || !pw || !name || !email || !address || !number2 || !number3
            || !hbd.year || !hbd.month || !hbd.day) {
            alert("필수항목을 입력해주세요");
            return;
        }

        // // 아이디 중복확인 체크
        // if (!idChecked) {
        //     alert("아이디 중복확인을 해주세요!");
        //     return;
        // }
<<<<<<< HEAD

        // 비밀번호 일치 확인
        if (pw !== pwCheck) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }
        const birth = `${hbd.year}-${String(hbd.month).padStart(2, '0')}-${String(hbd.day).padStart(2,'0')}`;

        // 회원정보 저장
        const userData = {
            id: id,
            pw: pw,
            name: name,
            email: email,
            address: address,
            number: fullNumber,
            hbd: birth
        };

        const response = await fetch("http://192.168.0.224:8080/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            alert("🎉회원가입 성공!");
            navigate('/main');
        } else {
            alert("❌회원가입 실패: " + result.message);
        }
    
    // ============================
    // JSX 반환
    // ============================
    return (
        <>
            <h2>회원가입</h2>

=======

        // 비밀번호 일치 확인
        if (pw !== pwCheck) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }

        // 회원정보 저장
        const userData = {
            id: id,
            pw: pw,
            name: name,
            email: email,
            address: address,
            number: fullNumber,
            hbd: hbd
        };

        localStorage.setItem("user", JSON.stringify(userData));
        alert("회원가입 완료");
        navigate('/main');
    }

    // ============================
    // JSX 반환
    // ============================
    return (
        <>
            <h2>회원가입</h2>

>>>>>>> 4c8dcfd3f27d8d9c635cf4073e3846e20d843cd9
            <div>
                <div>아이디</div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setIdChecked(false); // 아이디 변경 시 중복확인 초기화
                        }}
                    />
<<<<<<< HEAD
                    <button onClick={IdChecked}>중복확인</button>
=======
                    {/* <button onClick={IdChecked}>중복확인</button> */}
>>>>>>> 4c8dcfd3f27d8d9c635cf4073e3846e20d843cd9
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
                        onChange={(e) => setNumber3(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                        style={{ width: "80px", textAlign: "center" }}
                    />
                </div>
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
        </>
    );
<<<<<<< HEAD
}
=======
>>>>>>> 4c8dcfd3f27d8d9c635cf4073e3846e20d843cd9
}

export default Register;