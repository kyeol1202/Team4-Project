import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isLogin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ padding: "10px", display: "flex", gap: "15px" }}>
      <button onClick={() => navigate("/")}>Home</button>

      {isLogin ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <button onClick={() => navigate("/login")}>로그인</button>
      )}

      {isLogin && (
        <button onClick={() => navigate("/mypage")}>마이페이지</button>
      )}
    </header>
  );
}

export default Header;
