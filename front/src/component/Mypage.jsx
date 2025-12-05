import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else {
            alert("로그인 후 이용 가능합니다.");
            navigate("/");
        }
    }, [navigate]);

    const Logout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("user");
        alert("로그아웃 되었습니다.");
        navigate("/");
    };

    if (!user) return null;

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
