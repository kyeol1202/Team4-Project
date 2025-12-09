// server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// 1. 사용자 관련 API
// =========================

// 회원 목록 확인
app.get("/api/check-users", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM member");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 회원가입
app.post("/api/register", async (req, res) => {
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
      "INSERT INTO category (name) VALUES (?)",
      [name]
    );

    res.json({ success: true, message: "회원가입 성공!" });
  } catch (err) {
    console.log("❌회원가입 실패:", err);
    res.json({ success: false, message: "DB 오류발생" });
  }
});

// 로그인 API
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, message: "아이디와 비밀번호를 입력하세요." });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM member WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0)
      return res.json({ success: false, message: "로그인 정보가 올바르지 않습니다." });

    const user = rows[0];

    res.json({
      success: true,
      message: "로그인 성공",
      user: {
        member_id: user.member_id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// =========================
// 2. 상품 관련 API
// =========================

// 키워드 검색
app.get("/api/products", async (req, res) => {
  const keyword = req.query.keyword || "";

  try {
    const rows = await pool.query(
      "SELECT product_id, name, price, img FROM product WHERE name LIKE ?",
      [`%${keyword}%`]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 전체상품
app.get("/api/products/all", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 여성향수
app.get("/api/products/woman", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='여성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 남성향수
app.get("/api/products/man", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='남성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 상품 등록
app.post("/api/productadd", async (req, res) => {
  const { name, price, category_id } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO product (name, price, category_id)
      VALUES (?, ?, ?)
      `,
      [name, price, category_id]
    );

    res.json({ success: true, message: "상품 등록 성공!!" });
  } catch (err) {
    res.json({ success: false, message: "DB 오류 발생" });
  }
});

// =========================
// 3. 상품 상세 (여기 1개만 존재해야 함!!!)
// =========================

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await pool.query(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    const data = rows[0]; // ✔ 수정된 부분

    if (!data)
      return res.json({ success: false, message: "상품 없음" });

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "DB 오류", error: err.message });
  }
});


// =========================
// 서버 실행
// =========================

app.listen(8080, "0.0.0.0", () => {
  console.log("🚀 서버 실행 중: http://0.0.0.0:8080");
});
