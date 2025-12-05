import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
  const [wishList, setWishList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishList")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("wishList", JSON.stringify(wishList));
    }, 250);
    return () => clearTimeout(timer);
  }, [wishList]);

  const addToWish = (product) => {
    setWishList(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWish = (id) => setWishList(prev => prev.filter(item => item.id !== id));

  return (
    <WishContext.Provider value={{ wishList, addToWish, removeFromWish }}>
      {children}
    </WishContext.Provider>
  );
}

export function useWish() {
  return useContext(WishContext);
}
