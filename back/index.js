const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// 기존 기능 유지
// =========================

app.get("/api/check-users", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM member");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('DB 에러:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/category", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM category");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('DB 에러:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  const keyword = req.query.keyword || "";

  try {
    const rows = await pool.query(
      "SELECT product_id, name, price, img FROM product WHERE name LIKE ?",
      [`%${keyword}%`]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================
// 🔥 로그인 API
// =========================

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("🔍 로그인 요청:", username, password);

  if (!username || !password) {
    return res.json({ success: false, message: "아이디와 비밀번호를 입력하세요." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM member WHERE username = ? AND password = ?",
      [username, password]
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
// 회원가입
// =========================

app.post("/api/register", async (req, res) => {
  console.log("📥회원가입 요청:", req.body);

  const { id, pw, name, email, adderss, number, hbd } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO member
      (username, password, name, email, address, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [id, pw, name, email, adderss, number, hbd]
    );

    await pool.query(
      `
      INSERT INTO category
      (name)
      VALUES (?)
      `,
      [name]
    );

    return res.json({ success: true, message: "회원가입 성공!" });

  } catch (err) {
    console.log("❌회원가입 실패:", err);
    return res.json({ success: false, message: "DB 오류발생" })
  }
});

// =========================
// 상품 등록
// =========================

app.post("/api/productadd", async (req, res) => {
  console.log("📥상품등록 요청:", req.body);
  const { name, price, category_id } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO product (name, price, category_id)
      VALUES (?, ?, ?)
      `,
      [name, price, category_id]
    );

    return res.json({ success: true, message: "상품 등록 성공!!" });

  } catch (err) {
    console.error("❌상품등록 실패:", err);
    return res.json({ success: false, message: "DB 오류 발생" });
  }
});


// ==========================================================
// 🟦🟦🟦 여기부터 "새로 추가" 상품 API — 기존 코드 절대 수정 X
// ==========================================================

// 🔥 전체상품
app.get("/api/products/all", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("상품 전체 조회 오류:", err.message);
    res.status(500).json({ success: false });
  }
});

// 🔥 여성향수
app.get("/api/products/woman", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='여성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("여성향수 오류:", err.message);
    res.status(500).json({ success: false });
  }
});

// 🔥 남성향수
app.get("/api/products/man", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='남성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("남성향수 오류:", err.message);
    res.status(500).json({ success: false });
  }
});

// 🔥 상품 상세 (단 하나만 존재해야 함)
app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await pool.query(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    if (rows[0].length === 0) {
      return res.json({ success: false, message: "상품 없음" });
    }

    res.json({ success: true, data: rows[0][0] }); // << 여기!
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// ==========================================================
// 서버 실행
// ==========================================================
app.listen(8080, '0.0.0.0', () => {
  console.log("서버 실행 중: http://0.0.0.0:8080");
});
