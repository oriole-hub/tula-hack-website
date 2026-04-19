import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "../api/contracts";

interface SessionSnapshot {
  companyName: string;
  companyRegion: string;
  isAuthenticated: boolean;
  role: Role;
  userName: string;
}

interface SignInResult {
  ok: boolean;
  error?: string;
}

interface SessionState extends SessionSnapshot {
  signIn: (payload: { email: string; password: string; role: Role }) => SignInResult;
  signOut: () => void;
  registerCompany: (payload: {
    adminName: string;
    companyName: string;
    region: string;
  }) => void;
}

interface DemoAccount {
  email: string;
  password: string;
  role: Role;
  userName: string;
}

const STORAGE_KEY = "team-builder-session";

export const demoAccounts: DemoAccount[] = [
  {
    email: "admin@teambuilder.io",
    password: "Admin12345",
    role: "company_admin",
    userName: "Анастасия Белова",
  },
  {
    email: "hr@teambuilder.io",
    password: "Hr123456",
    role: "hr",
    userName: "Елена Миронова",
  },
  {
    email: "manager@teambuilder.io",
    password: "Manager123",
    role: "manager",
    userName: "Игорь Серов",
  },
];

const defaultSession: SessionSnapshot = {
  companyName: "TEAM BUILDER",
  companyRegion: "Москва",
  isAuthenticated: false,
  role: "company_admin",
  userName: "Администратор",
};

const SessionContext = createContext<SessionState | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionSnapshot>(() => {
    if (typeof window === "undefined") {
      return defaultSession;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSession;
    }

    try {
      return { ...defaultSession, ...JSON.parse(raw) };
    } catch {
      return defaultSession;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const value = useMemo<SessionState>(
    () => ({
      ...session,
      signIn: ({ email, password, role }) => {
        const account = demoAccounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

        if (!account) {
          return {
            ok: false,
            error: "Аккаунт с такой почтой не найден.",
          };
        }

        if (account.password !== password) {
          return {
            ok: false,
            error: "Неверный пароль для выбранного аккаунта.",
          };
        }

        if (account.role !== role) {
          return {
            ok: false,
            error: "Эта роль не соответствует выбранному аккаунту.",
          };
        }

        setSession((current) => ({
          ...current,
          isAuthenticated: true,
          role: account.role,
          userName: account.userName,
        }));

        return { ok: true };
      },
      signOut: () => {
        setSession((current) => ({
          ...current,
          isAuthenticated: false,
        }));
      },
      registerCompany: ({ adminName, companyName, region }) => {
        setSession({
          companyName,
          companyRegion: region,
          isAuthenticated: true,
          role: "company_admin",
          userName: adminName,
        });
      },
    }),
    [session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("Session context is not available");
  }
  return value;
};
