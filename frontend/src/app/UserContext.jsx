import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(()=>{
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // validate session on app start
  useEffect(() => {
    const initializeAuth = async () => {

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me", {withCredentials: true});
        const currentUser = response?.data?.data;

        setUser({
          email: currentUser?.email,
          role: currentUser?.role,
          studentID: currentUser?.studentID,
        });

      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
