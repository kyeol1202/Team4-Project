// server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ==================================
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// =========================
// 1. 사용자 관련 API
// =========================

// 회원 목록
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

    res.json({ success: true, message: "회원가입 성공!" });
  } catch (err) {
    res.json({ success: false, message: "DB 오류발생" });
  }
});

// 로그인 ✅ 수정
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, message: "아이디와 비밀번호를 입력하세요." });

  try {
    const rows = await pool.query(
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

// 카테고리
app.get("/api/category", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM category");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 상품 등록
// 상품 등록
app.post("/api/productadd", upload.single("img"), async (req, res) => {
  const {
    name,
    price,
    category_id,
    description,
    top_notes,
    middle_notes,
    base,
    volume,
    gender,
    perfume_type,
    longevity,
    sillage,
  } = req.body;

  const imgPath = req.file ? "/uploads/" + req.file.filename : null;

  try {
    await pool.query(
      `
      INSERT INTO product 
      (name, price, category_id, description, img, gender, top_notes, middle_notes, base_notes, volume, perfume_type, longevity, sillage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        price,
        category_id,
        description,
        imgPath,
        gender,
        top_notes,
        middle_notes,
        base,
        volume,
        perfume_type,
        longevity,
        sillage
      ]
    );

    res.json({ success: true, message: "상품 등록 성공!!" });
  } catch (err) {
    console.log("❌ 상품 등록 실패:", err);
    res.json({ success: false, message: "DB 오류 발생" });
  }
});

// =========================
// 3. 상품 상세 ✅ 수정
// =========================

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await pool.query(
      "SELECT * FROM product WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.json({ success: false, message: "상품 없음" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "DB 오류", error: err.message });
  }
});

// =========================
// 4. 위시리스트 API
// =========================

// 위시리스트 추가
app.post("/api/wish/add", async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const exists = await pool.query(
      "SELECT * FROM wishlist WHERE member_id=? AND product_id=?",
      [user_id, product_id]
    );

    if (exists.length > 0)
      return res.json({ success: false, message: "이미 찜한 상품입니다." });

    await pool.query(
      "INSERT INTO wishlist (member_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );

    return res.json({ success: true, message: "위시리스트에 추가되었습니다!" });

  } catch (err) {
    console.error("❌ wishlist 오류:", err);
    return res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 위시리스트 조회 ⭐ 이 부분이 있어야 합니다!
app.get("/api/wish/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const rows = await pool.query(
      `SELECT w.wishlist_id, w.product_id, p.name, p.price, p.img 
       FROM wishlist w
       JOIN product p ON w.product_id = p.product_id
       WHERE w.member_id = ?`,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ wishlist 조회 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 위시리스트 삭제
app.delete("/api/wish/remove", async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    await pool.query(
      "DELETE FROM wishlist WHERE member_id=? AND product_id=?",
      [user_id, product_id]
    );

    res.json({ success: true, message: "위시리스트에서 제거되었습니다!" });
  } catch (err) {
    console.error("❌ wishlist 삭제 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// =========================
// 5. 장바구니 API ✅ 수정
// =========================
app.post("/api/cart/add", async (req, res) => {
  const { user_id, product_id, count } = req.body;

  try {
    const exist = await pool.query(
      "SELECT * FROM cart WHERE member_id=? AND product_id=?",
      [user_id, product_id]
    );

    if (exist.length > 0)
      return res.json({ success: false, message: "이미 장바구니에 있음" });

    await pool.query(
      "INSERT INTO cart (member_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, count || 1]
    );

    return res.json({ success: true, message: "장바구니 추가 완료!" });

  } catch (err) {
    console.log("❌ cart 오류:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}); 

// =========================
// 서버 실행
// =========================
app.listen(8080, "0.0.0.0", () => {
  console.log("🚀 서버 실행 중: http://0.0.0.0:8080");
});