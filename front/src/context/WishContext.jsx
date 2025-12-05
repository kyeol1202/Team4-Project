import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
    const [wishList, setWishList] = useState(() => {
        try { return JSON.parse(localStorage.getItem("wishList")) || []; }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem("wishList", JSON.stringify(wishList));
    }, [wishList]);

    const addToWish = (product) => {
        setWishList(prev => {
            const exist = prev.find(item => item.id === product.id);
            if (exist) return prev; // 이미 찜하면 중복 방지
            return [...prev, product];
        });
    };

    const removeFromWish = (id) => {
        setWishList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <WishContext.Provider value={{ wishList, addToWish, removeFromWish }}>
            {children}
        </WishContext.Provider>
    );
}

export function useWish() {
    return useContext(WishContext);
}
