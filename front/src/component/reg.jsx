import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Reg() {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    async function addUser() {
        if (!userid.trim() || !userpw.trim() || !user.trim()) {
            alert("모든 입력 칸을 채워주세요!");
            return;
        }

        const response = await fetch('http://192.168.0.25:8080/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userid, pw: userpw, Name: user })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            localStorage.setItem("loginName", JSON.stringify(user));
            navigate('/');
        } else {
            alert(data.error);
        }
    }

    function re() {
        navigate('/');
    }

    return (
        <div className="center-screen">
            <div className="card">
                <p className="welcome-text">회원가입</p>
                <input placeholder="아이디" onChange={(e) => setUserid(e.target.value)} className="input"/>
                <input placeholder="비밀번호" onChange={(e) => setUserpw(e.target.value)} className="input"/>
                <input placeholder="닉네임" onChange={(e) => setUser(e.target.value)} className="input"/>
                <button className="button button-primary" onClick={addUser}>회원가입</button>
                <button className="button button-secondary" onClick={re}>이전</button>
            </div>
        </div>
    );
}

export default Reg;
