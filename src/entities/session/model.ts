import type { Role } from "../../shared/api/contracts";

export const roleLabels: Record<Role, string> = {
  company_admin: "Администратор компании",
  hr: "HR",
  manager: "Руководитель",
  employee: "Сотрудник",
};

export const roleOrder: Role[] = ["company_admin", "hr", "manager", "employee"];
