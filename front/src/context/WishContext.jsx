// context/WishContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
    const [wishList, setWishList] = useState([]);

    // 로컬스토리지에서 불러오기
    useEffect(() => {
        const storedWish = localStorage.getItem("wishList");
        if (storedWish) {
            setWishList(JSON.parse(storedWish));
        }
    }, []);

    // 로컬스토리지에 저장
    useEffect(() => {
        localStorage.setItem("wishList", JSON.stringify(wishList));
    }, [wishList]);

    const addToWish = (item) => {
        if (!wishList.find(w => w.id === item.id)) {
            setWishList(prev => [...prev, item]);
        }
    };

    const removeFromWish = (id) => {
        setWishList(prev => prev.filter(item => item.id !== id));
    };

    const toggleWish = (item) => {
        if (wishList.find(w => w.id === item.id)) {
            removeFromWish(item.id);
        } else {
            addToWish(item);
        }
    };

    return (
        <WishContext.Provider value={{ wishList, addToWish, removeFromWish, toggleWish }}>
            {children}
        </WishContext.Provider>
    );
}

export const useWish = () => useContext(WishContext);
