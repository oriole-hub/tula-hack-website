export type Role = "company_admin" | "hr" | "manager" | "employee";

export interface CompanySignupRequest {
  company_name: string;
  industry: string;
  company_size: string;
  region: string;
  admin_name: string;
  admin_email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface TeamCreateRequest {
  name: string;
  department: string;
  mission: string;
  team_type: string;
  maturity_stage: string;
}

export interface EmployeeCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  department: string;
  manager_id: string;
  tenure_months: number;
  work_mode: string;
}

export interface EmployeeProfileUpdateRequest {
  hard_skills: string[];
  soft_skills: string[];
  education: string;
  communication_style: string;
  growth_interest: number;
  values: string[];
}

export interface DiscSubmissionRequest {
  employee_id: string;
  dominant_style: "D" | "I" | "S" | "C";
  secondary_style: "D" | "I" | "S" | "C";
  notes: string;
}

export interface MotivationSubmissionRequest {
  employee_id: string;
  motivators: string[];
  autonomy_level: number;
  change_orientation: number;
  stress_triggers: string[];
}

export interface PulseSubmissionRequest {
  mood: number;
  stress: number;
  workload: number;
  recognition: number;
  collaboration: number;
  attrition_signal: number;
  comment: string;
}

export interface IdealProfileCreateRequest {
  role_name: string;
  mission: string;
  hard_skills: string[];
  soft_skills: string[];
  disc_profile: string[];
  motivators: string[];
  success_criteria: string[];
}

export interface CandidateCreateRequest {
  full_name: string;
  email: string;
  target_role: string;
  summary: string;
  skills: string[];
}

export interface CandidateFitResponse {
  candidate_id: string;
  ideal_profile_id: string;
  fit_score: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

export interface TeamRiskItem {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  reason: string;
  action: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface TeamDashboardResponse {
  team_id: string;
  team_name: string;
  health_index: number;
  chemistry_score: number;
  conflict_risk: number;
  attrition_risk: number;
  talent_pool_score: number;
  succession_score: number;
  recommendations: string[];
}
