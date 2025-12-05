const express = require('express');
const cors = require('cors');
const pool = require('./db'); // DB 연결 파일

const app = express();
app.use(cors());
app.use(express.json());

/* =====================================================
   🔵 1. 사용자 조회 (테스트용)
===================================================== */
app.get("/api/check-users", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM member LIMIT 5");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


/* =====================================================
   🟣 2. 상품 검색 API
===================================================== */
app.get("/api/products", async (req, res) => {
  const keyword = req.query.keyword || "";

  try {
    const rows = await pool.query(
      "SELECT product_id, name, price, img, gender FROM product WHERE name LIKE ?",
      [`%${keyword}%`]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


/* =====================================================
   🔵 3. 로그인 API
===================================================== */
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "아이디와 비밀번호를 입력하세요." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM member WHERE username = ? AND password = ?",
      [username, password]
    );

    const user = Array.isArray(result) ? result[0] : result;

    if (!user) {
      return res.json({ success: false, message: "로그인 정보가 올바르지 않습니다." });
    }

    return res.json({
      success: true,
      message: "로그인 성공",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        address: user.address
      }
    });

  } catch (err) {
    console.error("로그인 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});


/* =====================================================
   🔴 4. 아이디 중복 확인
===================================================== */
app.post("/check-id", async (req, res) => {
  const { id } = req.body;

  try {
    const rows = await pool.query(
      "SELECT * FROM member WHERE username = ?",
      [id]
    );

    if (rows.length > 0) {
      return res.json({ exists: true, message: "중복된 아이디입니다" });
    } else {
      return res.json({ exists: false, message: "사용 가능한 아이디입니다" });
    }

  } catch (err) {
    res.status(500).send("DB 오류");
  }
});


/* =====================================================
   🟢 5. 회원가입 저장
   ✔ 반드시 member 테이블에 저장해야 로그인됨
===================================================== */
app.post("/register", async (req, res) => {
  const { id, pw, name, email } = req.body;

  try {
    await pool.query(
      "INSERT INTO member (username, password, name, email) VALUES (?, ?, ?, ?)",
      [id, pw, name, email]
    );
    res.json({ success: true, message: "회원가입 성공!" });

  } catch (err) {
    console.error("회원가입 실패:", err);
    res.status(500).send("DB 오류");
  }
});


/* =====================================================
   🟡 6. 상품 추가 (관리자 기능)
===================================================== */
app.post("/api/products/add", async (req, res) => {
  const { name, price, gender, img, description } = req.body;

  try {
    await pool.query(
      "INSERT INTO product (name, price, gender, img, description) VALUES (?, ?, ?, ?, ?)",
      [name, price, gender, img, description]
    );
    res.json({ success: true, message: "상품 등록 성공" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*====================================================*/

app.get("/api/products/woman", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT name, price, img FROM product WHERE gender='여성' LIMIT 3"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/api/products/man", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT name, price, img FROM product WHERE gender='남성' LIMIT 3"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



/* =====================================================
   서버 실행
===================================================== */
app.listen(8080, '0.0.0.0', () => {
  console.log("서버 실행 중: http://0.0.0.0:8080");
});
