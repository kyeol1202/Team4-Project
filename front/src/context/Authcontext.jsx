import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  // 초기 로컬스토리지 체크
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loginUser"));
    if (storedUser) {
      setIsLogin(true);
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("loginUser", JSON.stringify(userData));
    setIsLogin(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("loginUser");
    setIsLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


