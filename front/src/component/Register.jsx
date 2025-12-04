import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate();
    const [id,setId] = useState('');
    const [pw,setPw] = useState('');
    const [pwCheck, setPwCheck] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [address,setAddress] = useState('');
    const [number,setNumber] = useState('');
    const [hbd,setHbd] = useState(''); //hbd >> 생년월일

    function register() {
        if(!id || !pw || !name || !email || !address || !number || !hbd) { //필수항목이 비어있을 때
        alert("필수항목을 입력해주세요");
        return;
        }
        if (pw !== pwCheck) {
        alert("비밀번호가 일치하지 않습니다");
        return;
        }

        //LocalStorage에 저장
        localStorage.setItem('id',id);
        localStorage.setItem('pw',pw);
        localStorage.setItem('name',name);
        localStorage.setItem('email',email);
        localStorage.setItem('address',address);
        localStorage.setItem('number',number);
        localStorage.setItem('hbd',hbd);

        alert("회원가입 완료")

        //회원가입 후 메인페이지로 이동
        navigate('/main');
    }

    
    //회원가입
    return(
        <>
        <h2>회원가입</h2>

            <div>
            <div>아이디</div>
            <input type="text" value={id} onChange={(e)=>setId(e.target.value)}/>
            </div>
            <div>
            <div>비밀번호</div>
            <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)}/>
            </div>
            <div>
            <div>비밀번호 확인</div>
            <input type="password" value={pwCheck} onChange={(e)=>setPwCheck(e.target.value)} />
            </div>
            <div>
            <div>성함</div>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
            <div>이메일</div>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>
            <div>주소</div>
            <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)}/>
            </div>
            <div>
            <div>전화번호</div>
            <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/>
            </div>
            <div>
            <div>생년월일</div>
            <input type="text" value={hbd} onChange={(e)=>setHbd(e.target.value)}/>
            </div>
            <button onClick={() => navigate("/")}>🏡</button>
            <button onClick={register}>회원가입</button>
        </>
    )

}

export default Register;