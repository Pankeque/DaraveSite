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

  // Helper function to sanitize error messages
  const sanitizeErrorMessage = (message: string): string => {
    // Check if message contains code-related content or HTML
    if (message.includes('<!DOCTYPE') || 
        message.includes('<html') ||
        message.includes('<body') ||
        message.includes('SyntaxError') || 
        message.includes('ReferenceError') ||
        message.includes('TypeError') ||
        message.includes('at ') ||
        message.includes('.ts:') ||
        message.includes('.js:') ||
        message.includes('stack') ||
        message.includes('Error:') ||
        message.includes('function') ||
        message.includes('undefined') ||
        message.includes('Cannot read') ||
        message.includes('not valid JSON') ||
        message.includes('Unexpected token')) {
      return "A server error occurred. Please try again later.";
    }
    return message;
  };

  // Helper function to safely parse JSON response
  const safeParseJSON = async (res: Response): Promise<{ data: any; error: string | null }> => {
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await res.text();
        if (!text || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          return { data: null, error: "Server returned HTML instead of JSON" };
        }
        try {
          return { data: JSON.parse(text), error: null };
        } catch {
          return { data: null, error: "Invalid JSON response" };
        }
      } else {
        const text = await res.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          return { data: null, error: "Server returned HTML instead of JSON" };
        }
        return { data: { message: text }, error: null };
      }
    } catch (e) {
      return { data: null, error: "Failed to read response" };
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
      const { data, error } = await safeParseJSON(res);
      if (error) {
        throw new Error("A server error occurred. Please try again later.");
      }
      throw new Error(sanitizeErrorMessage(data?.message || "Login failed"));
    }

    const { data, error } = await safeParseJSON(res);
    if (error || !data) {
      throw new Error("Failed to process server response");
    }
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
      const { data, error } = await safeParseJSON(res);
      if (error) {
        throw new Error("A server error occurred. Please try again later.");
      }
      throw new Error(sanitizeErrorMessage(data?.message || "Registration failed"));
    }

    const { data, error } = await safeParseJSON(res);
    if (error || !data) {
      throw new Error("Failed to process server response");
    }
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
