import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        navigate("/");
      }
    } else {
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
      <p><strong>이름:</strong> {user.name}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>주소:</strong> {user.address}</p>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>메인으로</button>
        <button onClick={Logout}>로그아웃</button>
      </div>
    </div>
  );
}

export default Mypage;
