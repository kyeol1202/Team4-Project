import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 임시 DB (실제 MySQL 등으로 교체 가능)
let cartDB = []; // {user_id, product_id, name, price, qty, id}
let ordersDB = []; // {id, user_id, items, total, payment_method, status}

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
    approval_url: "http://localhost:3000/payment-success",
    cancel_url: "http://localhost:3000/cart",
    fail_url: "http://localhost:3000/cart",
  });

  const res = await fetch("https://kapi.kakao.com/v1/payment/ready", {
    method: "POST",
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`, // .env에서 설정 필요
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params.toString()
  });

  return res.json();
};

// 🔹 Cart 조회
app.get("/api/cart/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const data = cartDB.filter(item => item.user_id === userId);
  res.json({ success: true, data });
});

// 🔹 Cart 수량 업데이트
app.put("/api/cart/update", (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const item = cartDB.find(i => i.user_id == user_id && i.product_id == product_id);
  if (item) item.qty = quantity;
  res.json({ success: true });
});

// 🔹 Cart 삭제
app.delete("/api/cart/remove", (req, res) => {
  const { user_id, product_id } = req.body;
  cartDB = cartDB.filter(i => !(i.user_id == user_id && i.product_id == product_id));
  res.json({ success: true });
});

// 🔹 결제 준비
app.post("/api/kakao-pay/ready", async (req, res) => {
  const { items, total, user_id } = req.body;
  try {
    const orderId = ordersDB.length + 1;
    ordersDB.push({ id: orderId, user_id, items, total, payment_method: "kakao", status: "ready" });
    const data = await kakaoPay(items, total);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "카카오페이 준비 실패" });
  }
});

// 🔹 네이버페이 / 카드 결제 (임시)
app.post("/api/naver-pay/ready", (req, res) => {
  const { items, total, user_id } = req.body;
  const orderId = ordersDB.length + 1;
  ordersDB.push({ id: orderId, user_id, items, total, payment_method: "naver", status: "ready" });
  res.json({ next_redirect_pc_url: "http://localhost:3000/payment-success?order_id=" + orderId });
});

app.post("/api/card-pay/ready", (req, res) => {
  const { items, total, user_id } = req.body;
  const orderId = ordersDB.length + 1;
  ordersDB.push({ id: orderId, user_id, items, total, payment_method: "card", status: "ready" });
  res.json({ next_redirect_pc_url: "http://localhost:3000/payment-success?order_id=" + orderId });
});

// 🔹 현금 결제
app.post("/api/order/create", (req, res) => {
  const { user_id, items, total } = req.body;
  const orderId = ordersDB.length + 1;
  ordersDB.push({ id: orderId, user_id, items, total, payment_method: "cash", status: "pending" });
  res.json({ success: true, orderId });
});

app.listen(8080, () => console.log("Server running on port 8080"));
