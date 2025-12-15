const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
require("dotenv").config();

const app = express();

/* ------------------------- 기본 설정 ------------------------- */

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}, express.static(path.join(__dirname, "uploads")));

const multer = require("multer");

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

/* ------------------------- 회원 관리 ------------------------- */

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
  const { id, pw, name, email, adderss, number, hbd, role } = req.body;
  try {
    await pool.query(
      `
      INSERT INTO member
      (username, password, name, email, address, phone, created_at, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [id, pw, name, email, adderss, number, hbd, role]
    );
    res.json({ success: true, message: "회원가입 성공!" });
  } catch (err) {
    res.json({ success: false, message: "DB 오류발생" });
  }
});

// 로그인
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

/* ------------------------- 검색 기능 ------------------------- */

app.get("/api/products", async (req, res) => {
  const keyword = req.query.keyword || "";
  try {
    const rows = await pool.query(
      `SELECT product_id, name, price, img, description 
       FROM product 
       WHERE name LIKE ? 
       OR search_tags LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 통합 검색
app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword || keyword.trim() === "") {
    return res.json({ success: true, data: [] });
  }

  try {
    const rows = await pool.query(
      `
      SELECT product_id, name, price, img, gender
      FROM product
      WHERE name LIKE ?
      OR description LIKE ?
      OR search_tags LIKE ?
      `,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ 검색 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

/* ------------------------- 관리자용 검색 기능 ------------------------- */

app.get("/admin/search", (req, res) => {
  const { keyword } = req.query;

  const sql = `
    SELECT 
      o.order_id,
      m.member_id,
      m.name,
      o.product_name,
      o.status
    FROM orders o
    JOIN members m ON o.member_id = m.member_id
    WHERE m.name LIKE ? OR o.product_name LIKE ?
  `;

  const value = `%${keyword}%`;

  pool.query(sql, [value, value], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


/* ------------------------- 상품 목록 ------------------------- */

app.get("/api/products/all", async (req, res) => {
  let { sort, min, max } = req.query;

  let query = "SELECT * FROM product WHERE 1=1";
  let params = [];

  // 가격 필터
  if (min) {
    query += " AND price >= ?";
    params.push(Number(min));
  }
  if (max) {
    query += " AND price <= ?";
    params.push(Number(max));
  }

  // 정렬
  if (sort === "price_asc") query += " ORDER BY price ASC";
  else if (sort === "price_desc") query += " ORDER BY price DESC";
  else if (sort === "new") query += " ORDER BY product_id DESC";

  try {
    const rows = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

app.get("/api/products/woman", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='여성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/api/products/man", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM product WHERE gender='남성'");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------------- 카테고리 ------------------------- */

app.get("/api/category", async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM category");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ------------------------- 상품 등록 ------------------------- */

app.post("/api/productadd", upload.single("img"), async (req, res) => {
  const {
    name, price, category_id, description, top_notes,
    middle_notes, base, volume, gender, perfume_type,
    longevity, sillage, search_tags
  } = req.body;

  const imgPath = req.file ? "/uploads/" + req.file.filename : null;

  try {
    await pool.query(
      `INSERT INTO product 
      (name, price, category_id, description, img, gender, top_notes, middle_notes, base_notes, volume, perfume_type, longevity, sillage, search_tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name, price, category_id, description, imgPath, gender,
        top_notes, middle_notes, base, volume, perfume_type,
        longevity, sillage, search_tags
      ]
    );

    res.json({ success: true, message: "상품 등록 성공!!" });
  } catch (err) {
    console.log("❌ 상품 등록 실패:", err);
    res.json({ success: false, message: "DB 오류 발생" });
  }
});

/* ------------------------- 상품 상세 ------------------------- */

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
    return res.status(500).json({ success: false, message: "DB 오류" });
  }
});

/* ------------------------- 상품 수정 ------------------------- */

app.put("/api/product-edit/:id", upload.single("img"), async (req, res) => {
  const id = req.params.id;

  const {
    name,
    price,
    category_id,
    description,
    top_notes,
    middle_notes,
    base_notes,
    volume,
    gender,
    perfume_type,
    longevity,
    sillage,
    search_tags
  } = req.body;

  // 이미지가 새로 업로드되었으면 경로 저장
  const imgPath = req.file ? "/uploads/" + req.file.filename : null;

  try {
    // 기존 데이터를 업데이트 (이미지 업데이트 포함)
    const query = `
      UPDATE product SET
        name = ?,
        price = ?,
        category_id = ?,
        description = ?,
        gender = ?,
        top_notes = ?,
        middle_notes = ?,
        base_notes = ?,
        volume = ?,
        perfume_type = ?,
        longevity = ?,
        sillage = ?,
        search_tags = ?
        ${imgPath ? `, img = '${imgPath}'` : ""}
      WHERE product_id = ?
    `;

    await pool.query(query, [
      name,
      price,
      category_id,
      description,
      gender,
      top_notes,
      middle_notes,
      base_notes,
      volume,
      perfume_type,
      longevity,
      sillage,
      search_tags,
      id,
    ]);

    res.json({ success: true, message: "상품 수정 완료!" });
  } catch (err) {
    console.error("❌ 상품 수정 실패:", err);
    res.status(500).json({ success: false, message: "DB 오류 발생" });
  }
});

/* ------------------------- 위시리스트 ------------------------- */

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
    return res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 위시 조회
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
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 위시 삭제
app.delete("/api/wish/remove", async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    await pool.query(
      "DELETE FROM wishlist WHERE member_id=? AND product_id=?",
      [user_id, product_id]
    );
    res.json({ success: true, message: "위시리스트에서 제거되었습니다!" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------------- 장바구니 ------------------------- */

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
    return res.status(500).json({ success: false });
  }
});

// 장바구니 조회
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const rows = await pool.query(
      `SELECT 
         c.cart_id AS id,      
         c.member_id,
         c.product_id,
         c.quantity AS qty,
         p.name,
         p.price,
         p.img
       FROM cart c
       JOIN product p ON c.product_id = p.product_id
       WHERE c.member_id = ?`,
      [req.params.userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------------- 갯수 업데이트 ------------------------- */

app.put("/api/cart/update", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    await pool.query(
      "UPDATE cart SET quantity = ? WHERE member_id = ? AND product_id = ?",
      [quantity, user_id, product_id]
    );
    res.json({ success: true, message: "수량이 업데이트되었습니다." });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------------- 장바구니 삭제 ------------------------- */

app.delete("/api/cart/remove", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query(
      "DELETE FROM cart WHERE member_id = ? AND product_id = ?",
      [user_id, product_id]
    );
    res.json({ success: true, message: "장바구니에서 삭제되었습니다." });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================================================================
          ⭐⭐⭐ 여기서부터 AI 챗봇 기능 추가됨 (기존 기능 NOT TOUCH)
===========================================================================*/

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* 🔥 챗봇: 사용자 개인 데이터 가져오기 */
async function getUserContext(userId) {
  if (!userId) return {};

  const ctx = {};

  const member = await pool.query(
    "SELECT member_id, name, gender FROM member WHERE member_id = ?",
    [userId]
  );
  ctx.member = member[0] || null;

  const wishlist = await pool.query(
    `SELECT p.name, p.scent_family
     FROM wishlist w
     JOIN product p ON w.product_id = p.product_id
     WHERE w.member_id = ?
     LIMIT 5`,
    [userId]
  );
  ctx.wishlist = wishlist;

  const orders = await pool.query(
    `SELECT o.order_id, o.order_status, p.name AS product_name
     FROM orders o
     JOIN product p ON o.product_id = p.product_id
     WHERE o.member_id = ?
     LIMIT 3`,
    [userId]
  );
  ctx.orders = orders;

  return ctx;
}

/* 챗봇 API */
app.post("/api/chatbot", async (req, res) => {
  const { message, user_id } = req.body;

  if (!message) return res.json({ success: false, reply: "메시지가 없습니다." });

  try {
    const ctx = await getUserContext(user_id);

    const prompt = `
너는 AuRa 향수 쇼핑몰 AI 상담원이다.
사용자 정보:
${JSON.stringify(ctx, null, 2)}

사용자 질문: "${message}"

역할:
- 향수 추천 + 제품 설명
- 사용자 위시리스트 기반 추천
- 주문 상태 안내
- 친절하고 간결하게 답변
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "너는 향수 쇼핑몰 상담원 AI이다." },
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.choices[0].message.content;

    return res.json({ success: true, reply });
  } catch (err) {
    console.error("❌ 챗봇 오류:", err);
    return res.json({ success: false, reply: "서버 오류가 발생했습니다." });
  }
});

/* ------------------------- 서버 실행 ------------------------- */

/* ---------------------- GAME 1: Snake 랭킹 ---------------------- */

// 랭킹 불러오기
app.get("/game", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT name, score FROM game ORDER BY score DESC LIMIT 10"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("게임1 랭킹 불러오기 오류:", err);
    res.json({ success: false, message: "DB 오류" });
  }
});

// 랭킹 저장
app.post("/game", async (req, res) => {
  const { name, score } = req.body;

  if (!name || score === undefined) {
    return res.json({ success: false, message: "데이터 부족" });
  }

  try {
    await pool.query(
      `
      INSERT INTO game (name, score)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      score = GREATEST(score, VALUES(score))
      `,
      [name, score]
    );

    res.json({ success: true, message: "랭킹 저장/갱신 완료" });
  } catch (err) {
    console.error("게임 랭킹 저장 오류:", err);
    res.json({ success: false, message: "DB 오류" });
  }
});

/* ---------------------- GAME 2: Enemy Avoid 랭킹 ---------------------- */

// 랭킹 불러오기
app.get("/game2", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT name, score FROM game2 ORDER BY score DESC LIMIT 10"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("게임2 랭킹 불러오기 오류:", err);
    res.json({ success: false, message: "DB 오류" });
  }
});

// 랭킹 저장
app.post("/game2", async (req, res) => {
  const { name, score } = req.body;

  if (!name || score === undefined) {
    return res.json({ success: false, message: "데이터 부족" });
  }

  try {
    await pool.query(
      `
      INSERT INTO game2 (name, score)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      score = GREATEST(score, VALUES(score))
      `,
      [name, score]
    );

    res.json({ success: true, message: "랭킹 저장/갱신 완료" });
  } catch (err) {
    console.error("게임2 랭킹 저장 오류:", err);
    res.json({ success: false, message: "DB 오류" });
  }
});

app.get("/api/products/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const { sort, min, max } = req.query;

  let query = `SELECT * FROM product WHERE category_id = ?`;
  let params = [categoryId];

  // 가격 필터 추가
  if (min) {
    query += " AND price >= ?";
    params.push(Number(min));
  }
  if (max) {
    query += " AND price <= ?";
    params.push(Number(max));
  }

  // 정렬 추가
  if (sort === "price_asc") query += " ORDER BY price ASC";
  if (sort === "price_desc") query += " ORDER BY price DESC";
  if (sort === "new") query += " ORDER BY product_id DESC"; // 신상품순

  try {
    const rows = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   주문 + 결제 생성 (FINAL)
========================= */
/* ========================= 주문내역 조회 ========================= */

app.get("/api/order/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // 1️⃣ 주문 목록
    const orders = await pool.query(
      `SELECT 
         o.order_id,
         o.order_date,
         o.total_amount,
         o.status,
         o.order_number
       FROM orders o
       WHERE o.member_id = ?
       ORDER BY o.order_date DESC`,
      [userId]
    );

    if (orders.length === 0) {
      return res.json({ success: true, orders: [] });
    }

    // 2️⃣ 주문 ID 목록
    const orderIds = orders.map(o => o.order_id);

    // 3️⃣ 주문 상품 조회
    const items = await pool.query(
      `SELECT 
         oi.order_id,
         oi.product_id,
         oi.quantity,
         oi.unit_price,
         p.name AS product_name
       FROM order_items oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    // 4️⃣ 프론트에서 쓰기 좋은 형태로 가공
    const result = orders.map(order => ({
      id: order.order_id,
      orderNumber: order.order_number,
      status: order.status,
      total: order.total_amount,
      date: order.order_date,
      items: items
        .filter(i => i.order_id === order.order_id)
        .map(i => ({
          productId: i.product_id,
          productName: i.product_name,
          qty: i.quantity,
          price: i.unit_price
        }))
    }));

    res.json({ success: true, orders: result });

  } catch (err) {
    console.error("❌ 주문 조회 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

/* ========================= 테스트용 간단 주문 라우트 ========================= */





app.post("/api/order/create", async (req, res) => {
  console.log("🎯 주문 라우트 호출됨!");
  console.log("📦 받은 데이터:", req.body);

  const { user_id, items, total, delivery, paymentMethod } = req.body;

  // 검증
  if (!user_id) {
    return res.status(400).json({ success: false, message: "로그인 필요" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "주문 상품 없음" });
  }

  if (!delivery?.name || !delivery?.phone || !delivery?.address) {
    return res.status(400).json({ success: false, message: "배송 정보 누락" });
  }

  if (!['kakaopay','naverpay','card','bank'].includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: "유효하지 않은 결제 수단" });
  }

  let conn;
  
  try {
    conn = await pool.getConnection();
    console.log("✅ DB 연결 성공");
    
    await conn.beginTransaction();
    console.log("✅ 트랜잭션 시작");

    // 주문번호 생성
    const d = new Date();
    const ymd = d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `ORD-${ymd}-${rand}`;

    // 1. 주문 생성
    const orderResult = await conn.query(
      `INSERT INTO orders
       (member_id, total_amount, shipping_address, receiver_name, receiver_phone, order_number, order_status)
       VALUES (?, ?, ?, ?, ?, ?, 'paid')`,
      [user_id, total, delivery.address, delivery.name, delivery.phone, orderNumber]
    );

    const orderId = Number(orderResult.insertId);
    console.log("✅ 주문 생성 완료, ID:", orderId);

    // 2. 주문 상품 저장
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.qty, item.price, item.price * item.qty]
      );
    }
    console.log("✅ 주문 상품 저장 완료");

    // 3. 결제 정보 저장
    await conn.query(
      `INSERT INTO payments (order_id, payment_method, amount, status)
       VALUES (?, ?, ?, 'paid')`,
      [orderId, paymentMethod, total]
    );
    console.log("✅ 결제 정보 저장 완료");

    // 4. 장바구니 비우기
    await conn.query(`DELETE FROM cart WHERE member_id = ?`, [user_id]);
    console.log("✅ 장바구니 비우기 완료");

    await conn.commit();
    console.log("✅ 트랜잭션 커밋 완료");

    return res.json({ success: true, order_id: orderId });

  } catch (err) {
    if (conn) {
      await conn.rollback();
      console.log("⚠️ 트랜잭션 롤백");
    }
    console.error("❌ 주문 생성 오류:", err);

    return res.status(500).json({
      success: false,
      message: "결제 처리 중 오류 발생",
      error: err.message
    });
  } finally {
    if (conn) {
      conn.release();
      console.log("🔓 DB 연결 해제");
    }
  }
});

/* ------------------------- 관리자용 ------------------------- */
app.get("/admin/orders", (req,res)=> {
  const sql = `
  SELECT
  o.member_id
  o.username,
  o.product,
  o.status,
  o.price
  FROM orders o
  JOIN members m ON o.username = m.username
  ORDER BY o.product_at DESC
  `;

  pool.query(sql, (err, results)=> {
    if(err) {
      console.error(arr);
      return res.status(500).json({ message : "주문 조회 실패"});
    }
    res.json(results);
  });
});


// 서버 시작 (맨 마지막!)
app.listen(8080, "0.0.0.0", () => {
  console.log("🚀 서버 실행 중: http://0.0.0.0:8080");
  console.log("📁 Static files: http://0.0.0.0:8080/uploads");
});

