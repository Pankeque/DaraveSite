import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@shared/routes";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(api.auth.me.path, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(api.auth.login.path, {
      method: api.auth.login.method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let errorMessage = "Login failed";
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } else {
          errorMessage = await res.text() || errorMessage;
        }
      } catch (e) {
        console.error("Error parsing response:", e);
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch(api.auth.register.path, {
      method: api.auth.register.method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      let errorMessage = "Registration failed";
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } else {
          errorMessage = await res.text() || errorMessage;
        }
      } catch (e) {
        console.error("Error parsing response:", e);
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch(api.auth.logout.path, {
      method: api.auth.logout.method,
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
