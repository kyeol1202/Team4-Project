import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedLogin = localStorage.getItem("login") === "true";
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setIsLogin(savedLogin);
    setUser(savedUser);
  }, []);

  const login = (userData) => {
    setIsLogin(true);
    setUser(userData);
    localStorage.setItem("login", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLogin(false);
    setUser(null);
    localStorage.removeItem("login");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
