import { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "auth_token";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) setTokenState(t);
  }, []);

  const setToken = (t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    setTokenState(t);
  };

  const logout = () => setToken(null);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), setToken, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { TOKEN_KEY };
