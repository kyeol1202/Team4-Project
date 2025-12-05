import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function Mypage(){
    const navigate = useNavigate();
     const [user, setUser] = useState(null);

      // 페이지 로드 시 localStorage에서 사용자 정보 가져오기
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            alert("로그인 후 이용 가능합니다.");
            navigate("/"); // 로그인 안 되어있으면 메인으로
        }
    }, [navigate]);
    
    const Logout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("user");
        alert("로그아웃 되었습니다.");
        navigate("/"); // 로그아웃 후 메인으로
    };

    if (!user) return null; // 유저 정보 없으면 렌더링 안 함

    return (
        <div style={{ padding: "40px" }}>
            <h2>마이페이지</h2>
            <p>이름: {user.name}</p>
            <p>이메일: {user.email}</p>
            <p>주소: {user.address}</p>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/")}>🏠 메인으로</button>
                <button onClick={Logout}>로그아웃</button>
            </div>
        </div>
    );
}

export default Mypage;