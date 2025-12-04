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

// 서버 실행
app.listen(8080, '0.0.0.0', () => {
    console.log("서버 실행 중: http://0.0.0.0:8080");
});
