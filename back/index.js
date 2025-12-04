const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결 테스트용 API (프론트엔드에서 호출 가능)
app.get("/api/check-users", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM member LIMIT 5"); // member 테이블 5개만 조회
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('DB 에러:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 로그인 기능 (이 부분만 추가)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: '이메일과 비밀번호를 입력하세요' });
  }

  try {
    const [user] = await pool.query("SELECT * FROM member WHERE email = ?", [email]);

    if (!user || user.length === 0) {
      return res.status(401).json({ success: false, error: '잘못된 이메일 또는 비밀번호' });
    }

    if (user[0].password !== password) {  // 평문 비교 (DB에 해시면 bcrypt.compare로 바꿔)
      return res.status(401).json({ success: false, error: '잘못된 이메일 또는 비밀번호' });
    }

    res.json({
      success: true,
      message: '로그인 성공',
      user: {
        member_id: user[0].member_id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role
      }
    });
  } catch (err) {
    console.error('로그인 에러:', err.message);
    res.status(500).json({ success: false, error: '서버 에러' });
  }
});

// 서버 실행
app.listen(8080, '0.0.0.0', () => {
    console.log("서버 실행 중: http://0.0.0.0:8080");
});