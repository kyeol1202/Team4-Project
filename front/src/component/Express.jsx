import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 카카오페이 결제 준비
const kakaoPay = async (items, total) => {
  const params = new URLSearchParams({
    cid: "TC0ONETIME",
    partner_order_id: "order_" + new Date().getTime(),
    partner_user_id: "user_123",
    item_name: items[0].name,
    quantity: items.reduce((sum, i) => sum + i.qty, 0),
    total_amount: total,
    vat_amount: Math.floor(total / 10),
    approval_url: "http://localhost:3000/complete",
    cancel_url: "http://localhost:3000/cancel",
    fail_url: "http://localhost:3000/fail",
  });

  const res = await fetch("https://kapi.kakao.com/v1/payment/ready", {
    method: "POST",
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params,
  });

  return res.json();
};

// API 라우트
app.post("/api/kakao-pay/ready", async (req, res) => {
  const { items, total } = req.body;
  try {
    const data = await kakaoPay(items, total);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "카카오페이 준비 실패" });
  }
});

// 네이버페이 (임시)
app.post("/api/naver-pay/ready", (req, res) => {
  res.json({ next_redirect_pc_url: "/complete" });
});

// 카드 (임시)
app.post("/api/card-pay/ready", (req, res) => {
  res.json({ next_redirect_pc_url: "/complete" });
});

// 서버 시작
app.listen(4000, () => console.log("Server running on port 4000"));
