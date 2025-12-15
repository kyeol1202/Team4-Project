import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./Cart.css";

const API_URL = "http://192.168.0.224:8080";
const GUEST_KEY = "guest_cart";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

  // ✅ 로그인 여부 (문자열 "null" 대응)
  const getUserId = () => {
    const id = localStorage.getItem("member_id");
    if (!id || id === "null" || id === "undefined") return null;
    return id;
  };

  const isGuest = !getUserId();

  const toggleSelect = (pid) =>
    setSelected((prev) =>
      prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]
    );

  // ✅ 게스트 장바구니 로드/저장
  const loadGuestCart = () => {
    const raw = localStorage.getItem(GUEST_KEY);
    const list = raw ? JSON.parse(raw) : [];
    // guest_cart는 count를 쓰는 경우가 많아서 qty로 맞춰줌
    return list.map((i) => ({
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      img: i.img,
      qty: i.qty ?? i.count ?? 1,
    }));
  };

  const saveGuestCart = (nextCart) => {
    // 저장할 때는 count로 통일해도 되고, qty로 해도 됨. 여기선 count로 저장
    const toSave = nextCart.map((i) => ({
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      img: i.img,
      count: i.qty,
    }));
    localStorage.setItem(GUEST_KEY, JSON.stringify(toSave));
  };

  // ✅ DB/게스트 공용 refresh
  const refreshCart = async () => {
    const userId = getUserId();

    // 게스트면 localStorage에서
    if (!userId) {
      const guest = loadGuestCart();
      setCart(guest);
      // 선택 목록이 기존 cart와 안 맞을 수 있으니 정리
      setSelected((prev) => prev.filter((pid) => guest.some((i) => i.product_id === pid)));
      return;
    }

    // 로그인면 DB에서
    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        setSelected((prev) => prev.filter((pid) => data.data.some((i) => i.product_id === pid)));
      }
    } catch (err) {
      console.error("장바구니 불러오기 오류:", err);
    }
  };

  // ✅ 수량 변경 (DB/게스트 분기)
  const updateQty = async (pid, newQty) => {
    if (newQty < 1) return;
    const userId = getUserId();

    if (!userId) {
      const next = cart.map((i) =>
        i.product_id === pid ? { ...i, qty: newQty } : i
      );
      setCart(next);
      saveGuestCart(next);
      return;
    }

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: pid, quantity: newQty }),
    });

    refreshCart();
  };

  // ✅ 삭제 (DB/게스트 분기)
  const removeItem = async (item) => {
    const userId = getUserId();

    if (!userId) {
      const next = cart.filter((i) => i.product_id !== item.product_id);
      setCart(next);
      setSelected((prev) => prev.filter((pid) => pid !== item.product_id));
      saveGuestCart(next);
      return;
    }

    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: item.product_id }),
    });

    refreshCart();
  };

  const total = useMemo(
    () =>
      cart
        .filter((i) => selected.includes(i.product_id))
        .reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart, selected]
  );

  useEffect(() => {
    refreshCart();
  }, []);

  // ✅ 결제 진입: 게스트는 로그인 유도 or guest checkout 페이지로
  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");

    const userId = getUserId();
    const items = cart.filter((i) => selected.includes(i.product_id));

    if (!userId) {
      // 선택지 1) 로그인 유도 (추천)
      // alert("결제는 로그인 후 가능합니다. 로그인 페이지로 이동합니다.");
      navigate("/cart", { state: { openLogin: true } });
      return;

      // 선택지 2) 비회원 결제 만들 거면 아래처럼
      // navigate("/payment", { state: { items, total, user_id: null, guest: true } });
      // return;
    }

    navigate("/payment", {
      state: { items, total, user_id: userId },
    });
  };

  return (
    <div className="cart-container">
      <h1>장바구니 {isGuest && <span style={{ fontSize: 14 }}>(비회원)</span>}</h1>

      <div className="cart-select-all">
        <button onClick={() => setSelected(cart.map((i) => i.product_id))}>전체 선택</button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>장바구니가 비었습니다.</p>
        ) : (
          cart.map((item) => (
            <div key={item.product_id} className="cart-item">
              <input
                type="checkbox"
                checked={selected.includes(item.product_id)}
                onChange={() => toggleSelect(item.product_id)}
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{Number(item.price).toLocaleString()}원</p>
              </div>

              <img
                className="cart-item-img"
                src={item.img?.startsWith("http") ? item.img : `${API_URL}${item.img}`}
                alt={item.name}
              />

              <div className="cart-item-qty">
                <button
                  onClick={() => updateQty(item.product_id, item.qty - 1)}
                  disabled={item.qty <= 1}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
              </div>

              <button className="cart-item-remove" onClick={() => removeItem(item)}>
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <h2>선택 총 금액: {total.toLocaleString()}원</h2>
        <div className="cart-actions">
          <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
          <button onClick={handleCheckout}>선택 상품 결제하기</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
