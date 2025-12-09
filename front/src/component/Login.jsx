import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const handleLogin = () => {
    login({ name: "회원명", id: "user01" });
    alert("로그인 성공");
    navigate("/");
  };

  return (
    <button onClick={handleLogin}>로그인</button>
  );
}
