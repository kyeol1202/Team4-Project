  const express = require('express');
  const cors = require('cors');
  const pool = require('./db');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.get("/api/products", async (req, res) => {
  const keyword = req.query.keyword || "";  // ?keyword=사과 처럼 들어옴

  try {
    const rows = await pool.query(
      "SELECT product_id, name, price FROM product WHERE name LIKE ?",
      [`%${keyword}%`]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

  // =========================
  // 👉 추가: 로그인 API
  // =========================

  app.post("/api/auth/login", async (req, res) => {
    const {username, password } = req.body;

    console.log("🔍 로그인 요청:",username, password);

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
  
  // 아이디 중복 확인
//   app.post("/check-id", async(req, res) => {
//   const { id } = req.body;

//   const sql = "SELECT * FROM member WHERE username = ?";
//   pool.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).send("DB 오류");

//     if (result.length > 0) {
//       return res.json({ exists: true , message: "중복된 아이디입니다" });   // 이미 존재
      
//     } else {
//       return res.json({ exists: false , message:"사용 가능한 아이디입니다" });  // 사용 가능
//     }
//   });
// });

//회원가입 저장
app.post("/api/register", async (req, res) => {
  console.log("📥회원가입 요청:" , req.body);

  const { id, pw, name, email, adderss, number, hbd } = req.body;

  try{
    await pool.query(
      `
      INSERT INTO member
      (username, password, name, email, address, phone, created_at)
      VALUES (?,?,?,?,?,?,?)
      `,
      [id, pw, name, email, adderss, number, hbd]
    );

    return res.json({ success: true, message:"회원가입 성공!"});

  } catch (err) {
    console.log("❌회원가입 실패:" , err);
    return res.json({ success : false, message: "DB 오류발생"})
  }
});

app.post("/api/productadd", async(req, res) => {

  console.log("📥상품등록 요청:", req.body);
  const { name , price , category_id  } = req.body;
  
    await pool.query(
      `
      INSERT INTO product
      (name, price, category_id)
      VALUES (?,?,?)
      `,
      [name, price, category_id]
    );

    return res.json({ success: true, message:"상품 등록 성공!!"});

})

  // =========================
  // 서버 실행
  // =========================
  app.listen(8080, '0.0.0.0', () => {
    console.log("서버 실행 중: http://0.0.0.0:8080");
  });
