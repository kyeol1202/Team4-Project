const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// 기존에 있던 API (유지)
// =========================

app.get("/api/check-users", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM member LIMIT 5");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('DB 에러:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/test", async (req, res) => {
  console.log("📌 /test 요청 도착");

  try {
    const rows = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error("🔥 /test DB 에러:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// =========================
// 👉 추가: 로그인 API
// =========================

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔍 로그인 요청:", email, password);

  if (!email || !password) {
    return res.json({ success: false, message: "이메일과 비밀번호를 입력하세요." });
  }

  try {
    const rows = await pool.query(
      "SELECT * FROM member WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "로그인 정보가 올바르지 않습니다." });
    }

    const user = rows[0];

    return res.json({
      success: true,
      message: "로그인 성공",
      user: {
        member_id: user.member_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("로그인 오류:", err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// =========================
// 서버 실행
// =========================
app.listen(8080, '0.0.0.0', () => {
  console.log("서버 실행 중: http://0.0.0.0:8080");
});
