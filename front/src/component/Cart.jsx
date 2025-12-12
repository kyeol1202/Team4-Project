import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

  // 체크박스 선택/해제
  const toggleSelect = (pid) =>
    setSelected((prev) =>
      prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]
    );

  // 장바구니 데이터 가져오기
  const refreshCart = async () => {
    const userId = localStorage.getItem("member_id");
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();

      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("장바구니 불러오기 오류:", err);
    }
  };

  // 수량 변경
  const updateQty = async (pid, newQty) => {
    if (newQty < 1) return;
    const userId = localStorage.getItem("member_id");

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: pid,
        quantity: newQty,
      }),
    });

    refreshCart();
  };

  // 아이템 삭제
  const removeItem = async (item) => {
    const userId = localStorage.getItem("member_id");

    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: item.product_id,
      }),
    });

    refreshCart();
  };

  // 총합 계산
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

  // 결제 페이지 이동
  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");

    const userId = localStorage.getItem("member_id");
    if (!userId) return alert("로그인이 필요합니다.");

    const selectedItems = cart.filter((i) =>
      selected.includes(i.product_id)
    );

    navigate("/payment", {
      state: {
        items: selectedItems,
        total,
        user_id: userId,
      },
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>장바구니</h1>

      {/* 전체 선택 / 해제 버튼 */}
      <div className="select-all">
        <button onClick={() => setSelected(cart.map((i) => i.product_id))}>전체 선택</button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      {/* 장바구니 상품 목록 */}
      {cart.map((item) => (
        <div key={item.product_id} className="product-item">
          <input
            type="checkbox"
            checked={selected.includes(item.product_id)}
            onChange={() => toggleSelect(item.product_id)}
          />

          {/* 상품 정보 */}
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>

          {/* 수량 조절 */}
          <div>
            <button
              onClick={() =>
                updateQty(item.product_id, item.qty - 1)
              }
              disabled={item.qty <= 1}
            >
              -
            </button>
            <span style={{ margin: "0 8px" }}>{item.qty}</span>
            <button
              onClick={() =>
                updateQty(item.product_id, item.qty + 1)
              }
            >
              +
            </button>
          </div>

          {/* 삭제 */}
          <button onClick={() => removeItem(item)}>삭제</button>
        </div>
      ))}

      {/* 총 금액 */}
      <h2>선택 총 금액: {total.toLocaleString()}원</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
        <button onClick={handleCheckout}>선택 상품 결제하기</button>
      </div>
    </div>
  );
}

export default Cart;
