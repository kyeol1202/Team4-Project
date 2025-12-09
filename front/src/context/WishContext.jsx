import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
  const [wishList, setWishList] = useState([]);

  // 컴포넌트 마운트 시 서버에서 위시리스트 가져오기
  useEffect(() => {
    fetchWishList();
  }, []);

  // 서버에서 위시리스트 조회
  const fetchWishList = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setWishList([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/wish/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWishList(data.data);
      } else {
        setWishList([]);
      }
    } catch (error) {
      console.error("❌ 위시리스트 조회 오류:", error);
      setWishList([]);
    }
  };

  // 위시리스트에 추가
  const addToWish = async (item) => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/wish/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: item.product_id,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("위시리스트에 추가되었습니다!");
        fetchWishList(); // 서버에서 최신 데이터 다시 가져오기
      } else {
        alert(data.message || "이미 위시리스트에 있습니다.");
      }
    } catch (error) {
      console.error("❌ 위시리스트 추가 오류:", error);
      alert("위시리스트 추가 중 오류가 발생했습니다.");
    }
  };

  // 위시리스트에서 제거
  const removeFromWish = async (productId) => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/wish/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("위시리스트에서 제거되었습니다!");
        // 로컬 상태에서도 즉시 제거 (UI 반응 빠르게)
        setWishList(prev => prev.filter(item => item.product_id !== productId));
      } else {
        alert("제거 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("❌ 위시리스트 제거 오류:", error);
      alert("위시리스트 제거 중 오류가 발생했습니다.");
    }
  };

  // 위시리스트 토글 (추가/제거)
  const toggleWish = async (item) => {
    const exists = wishList.find(w => w.product_id === item.product_id);
    
    if (exists) {
      await removeFromWish(item.product_id);
    } else {
      await addToWish(item);
    }
  };

  return (
    <WishContext.Provider value={{ 
      wishList, 
      addToWish, 
      removeFromWish, 
      toggleWish, 
      fetchWishList 
    }}>
      {children}
    </WishContext.Provider>
  );
}

export const useWish = () => useContext(WishContext);