import type { Role } from "../../shared/api/contracts";

export interface NavigationItem {
  path: string;
  label: string;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  { path: "/dashboard", label: "Дашборд", roles: ["company_admin", "hr", "manager"] },
  { path: "/teams", label: "Команды", roles: ["company_admin", "hr", "manager"] },
  { path: "/employees", label: "Сотрудники", roles: ["company_admin", "hr", "manager"] },
  { path: "/assessments", label: "Оценки", roles: ["company_admin", "hr", "manager", "employee"] },
  { path: "/ideal-profiles", label: "Идеальный профиль", roles: ["company_admin", "hr"] },
  { path: "/candidates", label: "Кандидаты", roles: ["company_admin", "hr"] },
  { path: "/risks", label: "Риски", roles: ["company_admin", "hr", "manager"] },
  { path: "/talent-pool", label: "Кадровый резерв", roles: ["company_admin", "hr"] },
  { path: "/succession-planning", label: "Преемственность", roles: ["company_admin", "hr"] },
  { path: "/notifications", label: "Уведомления", roles: ["company_admin", "hr", "manager", "employee"] },
];
