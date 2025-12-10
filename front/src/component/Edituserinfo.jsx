import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditUserInfo() {
  const navigate = useNavigate();
  const { isLogin, user, login } = useAuth();

  const [form, setForm] = useState({
    name: "", username: "", password: "", email: "", address: "", phone: "", birth: ""
  });

  useEffect(() => {
    if (!isLogin) navigate("/", { replace: true });
    else setForm(user||{});
  }, [isLogin, navigate, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(form));
    login(form);
    alert("정보가 수정되었습니다!");
    navigate("/mypage");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>회원 정보 수정</h2>
      {Object.keys(form).map((key) => (
        <div key={key} style={{ margin: "10px 0" }}>
          <input name={key} placeholder={key} value={form[key]} onChange={handleChange} />
        </div>
      ))}
      <button onClick={handleSubmit}>수정 완료</button>
    </div>
  );
}

export default EditUserInfo;

