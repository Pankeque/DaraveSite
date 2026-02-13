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

  // Helper function to format detailed error messages for debugging
  const formatDetailedError = (error: any, statusCode: number, url: string): string => {
    const details: string[] = [];
    
    details.push(`Status: ${statusCode}`);
    details.push(`URL: ${url}`);
    
    if (error?.message) {
      details.push(`Error: ${error.message}`);
    }
    
    if (error?.stack) {
      details.push(`Stack: ${error.stack}`);
    }
    
    if (error?.name) {
      details.push(`Type: ${error.name}`);
    }
    
    // Include any additional error properties
    if (error && typeof error === 'object') {
      Object.keys(error).forEach(key => {
        if (!['message', 'stack', 'name'].includes(key)) {
          try {
            const value = typeof error[key] === 'object' 
              ? JSON.stringify(error[key], null, 2) 
              : String(error[key]);
            details.push(`${key}: ${value}`);
          } catch {
            details.push(`${key}: [Unable to serialize]`);
          }
        }
      });
    }
    
    return details.join(' | ');
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
    console.log("[DEBUG] Login attempt for:", email);
    
    const res = await fetch(api.auth.login.path, {
      method: api.auth.login.method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("[DEBUG] Login response status:", res.status);

    if (!res.ok) {
      const { data, error } = await safeParseJSON(res);
      console.log("[DEBUG] Login error response:", { data, error });
      
      // Build detailed error message for debugging
      const errorDetails = formatDetailedError(
        { 
          ...data, 
          parseError: error,
          responseBody: data 
        }, 
        res.status, 
        api.auth.login.path
      );
      
      throw new Error(`LOGIN FAILED: ${errorDetails}`);
    }

    const { data, error } = await safeParseJSON(res);
    console.log("[DEBUG] Login success response:", { data, error });
    if (error || !data) {
      throw new Error(`LOGIN FAILED: Failed to process server response | Status: ${res.status} | Parse Error: ${error}`);
    }
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    console.log("[DEBUG] Register attempt for:", email, name);
    
    const res = await fetch(api.auth.register.path, {
      method: api.auth.register.method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    console.log("[DEBUG] Register response status:", res.status);

    if (!res.ok) {
      const { data, error } = await safeParseJSON(res);
      console.log("[DEBUG] Register error response:", { data, error });
      
      // Build detailed error message for debugging
      const errorDetails = formatDetailedError(
        { 
          ...data, 
          parseError: error,
          responseBody: data 
        }, 
        res.status, 
        api.auth.register.path
      );
      
      throw new Error(`REGISTRATION FAILED: ${errorDetails}`);
    }

    const { data, error } = await safeParseJSON(res);
    console.log("[DEBUG] Register success response:", { data, error });
    if (error || !data) {
      throw new Error(`REGISTRATION FAILED: Failed to process server response | Status: ${res.status} | Parse Error: ${error}`);
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
