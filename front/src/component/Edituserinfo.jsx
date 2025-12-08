import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function EditUserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    address: "",
    phone: "",
    birth: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    else navigate("/mypage");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("정보가 수정되었습니다.");
    navigate("/mypage");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>회원 정보 수정</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "350px" }}>
        <input name="name" value={user.name} onChange={handleChange} placeholder="이름" />
        <input name="username" value={user.username} onChange={handleChange} placeholder="아이디" />
        <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="비밀번호" />
        <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="이메일" />
        <input name="address" value={user.address} onChange={handleChange} placeholder="주소" />
        <input name="phone" value={user.phone} onChange={handleChange} placeholder="전화번호" />
        <input name="birth" value={user.birth} onChange={handleChange} placeholder="생년월일 (YYYY-MM-DD)" />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleSave}>저장</button>
          <button onClick={() => navigate("/mypage")}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default EditUserInfo;

