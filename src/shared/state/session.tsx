import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { Role } from "../api/contracts";

interface SessionState {
  role: Role;
  setRole: (role: Role) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("company_admin");
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("Session context is not available");
  }
  return value;
};
