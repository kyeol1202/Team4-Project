
import { useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate();
    const [id,setId] = useState('');
    const [pw,setPw] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [adress,setAdress] = useState('');
    const [number,setNumber] = useState('');
    const [hbd,setHbd] = useState(''); //hbd >> 생년월일

    function register() {
        if(!id || !pw) { //id와 pw가 비어있을 때
        alert("아이디와 비밀번호를 입력하세요.");
        return;
        }
        //LocalStorage에 저장
        localStorage.setItem('id',id);
        localStorage.setItem('pw',pw);
        localStorage.setItem('name',name);
        localStorage.setItem('email',email);
        localStorage.setItem('adress',adress);
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
            <input type="text" value={pw} onChange={(e)=>setPw(e.target.value)}/>
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
            <input type="text" value={adress} onChange={(e)=>setAdress(e.target.value)}/>
            </div>
            <div>
            <div>전화번호</div>
            <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/>
            </div>
            <div>
            <div>아이디</div>
            <input type="text" value={hbd} onChange={(e)=>setHbd(e.target.value)}/>
            </div>
            <button onClick={() => navigate("/")}>🏡</button>
            <button onClick={register}>
                회원가입
            </button>
        </>
    )

}

export default Register;