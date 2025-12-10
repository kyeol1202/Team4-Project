import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

// ⭐ API URL 통일
const API_URL = "http://192.168.0.224:8080";

export function WishProvider({ children }) {
  const [wishList, setWishList] = useState([]);

  // 컴포넌트 마운트 시 서버에서 위시리스트 가져오기
  useEffect(() => {
    fetchWishList();
  }, []);

  // 서버에서 위시리스트 조회
  const fetchWishList = async () => {
    const userId = localStorage.getItem("user_id");
    console.log("🔍 fetchWishList 호출, user_id:", userId);
    
    if (!userId) {
      console.log("❌ user_id 없음");
      setWishList([]);
      return;
    }

    try {
      const url = `${API_URL}/api/wish/${userId}`;
      console.log("📡 요청 URL:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("📥 서버 응답:", data);
      
      if (data.success) {
        console.log("✅ 위시리스트 데이터:", data.data);
        setWishList(data.data);
      } else {
        console.log("⚠️ success가 false:", data);
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
    console.log("🔍 addToWish 호출:", { userId, product_id: item.product_id });
    
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      const requestBody = {
        user_id: userId,
        product_id: item.product_id,
      };
      console.log("📤 전송 데이터:", requestBody);
      
      const response = await fetch(`${API_URL}/api/wish/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("📥 추가 응답:", data);
      
      if (data.success) {
        alert("위시리스트에 추가되었습니다!");
        await fetchWishList(); // 서버에서 최신 데이터 다시 가져오기
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
    console.log("🔍 removeFromWish 호출:", { userId, productId });
    
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      const requestBody = {
        user_id: userId,
        product_id: productId,
      };
      console.log("📤 삭제 요청:", requestBody);
      
      const response = await fetch(`${API_URL}/api/wish/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("📥 삭제 응답:", data);
      
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
    console.log("🔍 toggleWish 호출:", item);
    console.log("📋 현재 wishList:", wishList);
    
    const exists = wishList.find(w => w.product_id === item.product_id);
    console.log("존재 여부:", exists ? "있음" : "없음");
    
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