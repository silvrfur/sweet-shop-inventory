import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        return jwtDecode(token);
      }
    } catch (error) {
      console.error("Invalid token, clearing:", error);
      localStorage.removeItem("access_token");
    }
    return null;
  });

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("access_token", token);
    setUser(jwtDecode(token));
  };

  const register = async (payload) => {
    await api.post("/api/auth/register", payload);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
