import type { Role } from "../../shared/api/contracts";
import { navigationItems } from "../navigation/menu";

const publicRoutes = ["/signin", "/signup"];

export const canAccessRoute = (role: Role, path: string) => {
  if (publicRoutes.includes(path)) {
    return true;
  }

  const matched = navigationItems.find((item) => item.path === path);
  return matched ? matched.roles.includes(role) : false;
};

export const canManagePeople = (role: Role) =>
  ["company_admin", "hr", "manager"].includes(role);

export const canManageHiring = (role: Role) => ["company_admin", "hr"].includes(role);

export const getDefaultRoute = (role: Role) =>
  navigationItems.find((item) => item.roles.includes(role))?.path ?? "/signin";
