// routes/chatbot.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // 너가 쓰는 db 연결 파일 경로 맞춰서 수정

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 유틸: DB에서 개인 정보/위시리스트/주문 내역 가져오기
async function getUserContext(userId) {
  if (!userId) return {};

  const result = {};

  // 1) 회원 정보
  const members = await pool.query(
    "SELECT member_id, name, gender, age FROM member WHERE member_id = ?",
    [userId]
  );
  result.member = members[0] || null;

  // 2) 위시리스트에 담긴 상품들
  const wishlist = await pool.query(
    `SELECT p.product_id, p.name, p.note, p.scent_family
     FROM wishlist w
     JOIN product p ON w.product_id = p.product_id
     WHERE w.member_id = ?
     ORDER BY w.created_at DESC
     LIMIT 5`,
    [userId]
  );
  result.wishlist = wishlist;

  // 3) 최근 검색 기록
  const searches = await pool.query(
    `SELECT keyword, created_at
     FROM search_history
     WHERE member_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );
  result.searches = searches;

// 4) 최근 주문
const orders = await pool.query(
  `SELECT 
      o.order_id,
      o.status,
      o.order_date,
      GROUP_CONCAT(p.name SEPARATOR ', ') AS product_names
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN product p ON oi.product_id = p.product_id
    WHERE o.member_id = ?
    GROUP BY o.order_id, o.status, o.order_date
    ORDER BY o.order_date DESC
    LIMIT 3`,
  [userId]
);
result.orders = orders;


  return result;
}

// 🧠 GPT에 던질 프롬프트 만들기
function buildPrompt(message, ctx) {
  const { member, wishlist = [], searches = [], orders = [] } = ctx;

  let contextText = "";

  if (member) {
    contextText += `- 회원 이름: ${member.name}\n`;
    if (member.gender) contextText += `- 성별: ${member.gender}\n`;
    if (member.age) contextText += `- 나이: ${member.age}\n`;
  } else {
    contextText += `- 로그인 정보 없음 (비회원)\n`;
  }

  if (wishlist.length > 0) {
    contextText += `\n[위시리스트]\n`;
    wishlist.forEach((w) => {
      contextText += `- ${w.name} (${w.scent_family || "향 계열 정보 없음"})\n`;
    });
  }

  if (searches.length > 0) {
    contextText += `\n[최근 검색어]\n`;
    searches.forEach((s) => {
      contextText += `- ${s.keyword}\n`;
    });
  }

  if (orders.length > 0) {
    contextText += `\n[최근 주문]\n`;
    orders.forEach((o) => {
      contextText += `- 주문번호 ${o.order_id}: ${o.product_name}, 상태: ${o.order_status}\n`;
    });
  }

  const systemMsg = `
너는 AuRa 향수 쇼핑몰의 상담원 AI야.

역할:
1. 향수 제품 설명, 향 계열, 사용 상황에 맞는 추천을 해준다.
2. 제공된 회원/위시리스트/검색 기록/주문 정보가 있으면, 그걸 활용해서 "개인 맞춤" 답변을 한다.
3. 사용자가 주문 상태를 물어보면, 주어진 주문 리스트 안에서 찾아서 설명해준다.
4. 정보가 부족하면 "현재 확인 가능한 주문이 없습니다" 처럼 정직하게 말한다.
5. 말투는 너무 딱딱하지 않은 정중한 한국어로, 2~4문장 정도로 짧고 친절하게 답한다.
`;

  const userMsg = `
[사용자 메시지]
${message}

[사용자 관련 정보]
${contextText}
`;

  return { systemMsg, userMsg };
}

// 🧩 메인: 챗봇 API
router.post("/", async (req, res) => {
   const { message, user_id } = req.body;
    const userId = user_id;

  if (!message) {
    return res.status(400).json({ success: false, message: "message가 없습니다." });
  }

  try {
    // 1) 유저 관련 정보 가져오기
    const ctx = await getUserContext(userId);

    // 2) 프롬프트 만들기
    const { systemMsg, userMsg } = buildPrompt(message, ctx);

    // 3) 대화 로그 저장 (user)
    await pool.query(
      "INSERT INTO chat_logs (member_id, role, message) VALUES (?, 'user', ?)",
      [userId || null, message]
    );

    // 4) OpenAI 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // 또는 사용 가능한 모델
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
    });

    const reply = completion.choices[0].message.content;

    // 5) 대화 로그 저장 (bot)
    await pool.query(
      "INSERT INTO chat_logs (member_id, role, message) VALUES (?, 'bot', ?)",
      [userId || null, reply]
    );

    res.json({ success: true, reply });
  } catch (err) {
    console.error("챗봇 에러:", err);
    res.status(500).json({ success: false, message: "챗봇 서버 에러" });
  }
});



module.exports = router;
