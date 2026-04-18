import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  CandidateCreateRequest,
  DiscSubmissionRequest,
  EmployeeCreateRequest,
  EmployeeProfileUpdateRequest,
  IdealProfileCreateRequest,
  MotivationSubmissionRequest,
  NotificationItem,
  PulseSubmissionRequest,
  TeamCreateRequest,
} from "../api/contracts";
import {
  CandidateRecord,
  EmployeeRecord,
  IdealProfileRecord,
  RoleGap,
  SuccessionItem,
  TalentPoolItem,
  TeamRecord,
  candidates as initialCandidates,
  company,
  employees as initialEmployees,
  idealProfiles as initialIdealProfiles,
  matrix as initialMatrix,
  notifications as initialNotifications,
  risks,
  roleMap,
  successionPlan,
  talentPool,
  teamDashboard,
  teams as initialTeams,
} from "../mocks/portal";

interface PortalState {
  company: typeof company;
  teamDashboard: typeof teamDashboard;
  teams: TeamRecord[];
  employees: EmployeeRecord[];
  idealProfiles: IdealProfileRecord[];
  candidates: CandidateRecord[];
  notifications: NotificationItem[];
  risks: typeof risks;
  roleMap: RoleGap[];
  talentPool: TalentPoolItem[];
  successionPlan: SuccessionItem[];
  matrix: typeof initialMatrix;
  addTeam: (payload: TeamCreateRequest) => void;
  addEmployee: (payload: EmployeeCreateRequest & { team_id?: string }) => void;
  updateEmployeeProfile: (employeeId: string, payload: EmployeeProfileUpdateRequest) => void;
  submitDisc: (payload: DiscSubmissionRequest) => void;
  submitMotivation: (payload: MotivationSubmissionRequest) => void;
  submitPulse: (employeeId: string, payload: PulseSubmissionRequest) => void;
  addIdealProfile: (payload: IdealProfileCreateRequest) => void;
  addCandidate: (payload: CandidateCreateRequest) => void;
  markNotificationRead: (notificationId: string) => void;
}

const PortalContext = createContext<PortalState | null>(null);

const cloneTeams = () =>
  initialTeams.map((team) => ({
    ...team,
    members: team.members.map((member) => ({ ...member })),
  }));

const cloneEmployees = () =>
  initialEmployees.map((employee) => ({
    ...employee,
    skills: [...employee.skills],
    softSkills: [...employee.softSkills],
    values: [...employee.values],
    motivation: {
      ...employee.motivation,
      motivators: [...employee.motivation.motivators],
      stressTriggers: [...employee.motivation.stressTriggers],
    },
    disc: { ...employee.disc },
  }));

const cloneIdealProfiles = () =>
  initialIdealProfiles.map((profile) => ({
    ...profile,
    hardSkills: [...profile.hardSkills],
    softSkills: [...profile.softSkills],
    discProfile: [...profile.discProfile],
    motivators: [...profile.motivators],
    successCriteria: [...profile.successCriteria],
  }));

const cloneCandidates = () =>
  initialCandidates.map((candidate) => ({
    ...candidate,
    skills: [...candidate.skills],
    fit: {
      ...candidate.fit,
      strengths: [...candidate.fit.strengths],
      gaps: [...candidate.fit.gaps],
    },
  }));

const cloneNotifications = () => initialNotifications.map((item) => ({ ...item }));

const average = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

const createNotification = (title: string, body: string): NotificationItem => ({
  id: crypto.randomUUID(),
  title,
  body,
  is_read: false,
  created_at: new Date().toISOString(),
});

const appendMember = (team: TeamRecord, employee: EmployeeRecord): TeamRecord => ({
  ...team,
  members: [
    ...team.members,
    {
      employeeId: employee.id,
      fullName: employee.fullName,
      title: employee.title,
      disc: `${employee.disc.dominant}${employee.disc.secondary}`,
      performance: 72,
      potential: 74,
      pulse: employee.pulse,
    },
  ],
});

const updateEmployeeRecord =
  (employeeId: string, updater: (employee: EmployeeRecord) => EmployeeRecord) => (employee: EmployeeRecord) =>
    employee.id === employeeId ? updater(employee) : employee;

const buildCandidateFit = (payload: CandidateCreateRequest, profile?: IdealProfileRecord) => {
  if (!profile) {
    return {
      fit_score: 62,
      strengths: ["релевантный базовый опыт", "подходит под уровень роли"],
      gaps: ["нужно уточнить профиль мотивации", "не хватает эталонного профиля для точного сравнения"],
      recommendation: "Провести интервью по мотивации и рабочему стилю.",
    };
  }

  const skillSet = payload.skills.map((item) => item.trim().toLowerCase());
  const hardHits = profile.hardSkills.filter((item) => skillSet.includes(item.trim().toLowerCase()));
  const score = Math.min(96, 56 + hardHits.length * 10 + Math.min(10, payload.summary.length / 30));

  return {
    fit_score: Math.round(score),
    strengths: hardHits.length > 0 ? [`совпадают навыки: ${hardHits.join(", ")}`] : ["есть смежный опыт по роли"],
    gaps:
      hardHits.length < profile.hardSkills.length
        ? [`не полностью совпадают навыки: ${profile.hardSkills.filter((item) => !hardHits.includes(item)).join(", ")}`]
        : ["критичных разрывов не выявлено"],
    recommendation:
      hardHits.length >= 2
        ? "Перевести кандидата в следующий этап и проверить командную совместимость."
        : "Нужен дополнительный скрининг по ключевым навыкам и ожиданиям по роли.",
  };
};

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<TeamRecord[]>(cloneTeams);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(cloneEmployees);
  const [idealProfiles, setIdealProfiles] = useState<IdealProfileRecord[]>(cloneIdealProfiles);
  const [candidates, setCandidates] = useState<CandidateRecord[]>(cloneCandidates);
  const [notifications, setNotifications] = useState<NotificationItem[]>(cloneNotifications);

  const addNotification = (title: string, body: string) => {
    setNotifications((current) => [createNotification(title, body), ...current]);
  };

  const addTeam = (payload: TeamCreateRequest) => {
    const team: TeamRecord = {
      id: crypto.randomUUID(),
      name: payload.name,
      department: payload.department,
      mission: payload.mission,
      teamType: payload.team_type,
      maturityStage: payload.maturity_stage,
      members: [],
    };

    setTeams((current) => [team, ...current]);
    addNotification("Добавлена новая команда", `Команда «${payload.name}» появилась в рабочем контуре.`);
  };

  const addEmployee = (payload: EmployeeCreateRequest & { team_id?: string }) => {
    const fullName = `${payload.first_name} ${payload.last_name}`.trim();
    const team = teams.find((item) => item.id === payload.team_id);

    const employee: EmployeeRecord = {
      id: crypto.randomUUID(),
      fullName,
      role: "employee",
      title: payload.title,
      department: payload.department,
      teamId: payload.team_id ?? team?.id ?? "",
      manager: employees.find((item) => item.id === payload.manager_id)?.fullName ?? "Не назначен",
      workMode: payload.work_mode,
      tenureMonths: payload.tenure_months,
      pulse: 72,
      attritionRisk: 14,
      skills: [],
      softSkills: [],
      education: "Не заполнено",
      communicationStyle: "Уточняется",
      growthInterest: 70,
      values: [],
      disc: { dominant: "S", secondary: "C" },
      motivation: {
        motivators: ["рост", "понятные цели"],
        autonomyLevel: 6,
        changeOrientation: 6,
        stressTriggers: ["перегрузка", "неясные ожидания"],
      },
    };

    setEmployees((current) => [employee, ...current]);
    if (team) {
      setTeams((current) => current.map((item) => (item.id === team.id ? appendMember(item, employee) : item)));
    }

    addNotification("Добавлен новый сотрудник", `${fullName} добавлен в каталог сотрудников.`);
  };

  const updateEmployeeProfile = (employeeId: string, payload: EmployeeProfileUpdateRequest) => {
    setEmployees((current) =>
      current.map(
        updateEmployeeRecord(employeeId, (employee) => ({
          ...employee,
          skills: payload.hard_skills,
          softSkills: payload.soft_skills,
          education: payload.education,
          communicationStyle: payload.communication_style,
          growthInterest: payload.growth_interest,
          values: payload.values,
        })),
      ),
    );
    addNotification("Профиль обновлён", "Данные сотрудника сохранены и готовы для аналитики.");
  };

  const submitDisc = (payload: DiscSubmissionRequest) => {
    setEmployees((current) =>
      current.map(
        updateEmployeeRecord(payload.employee_id, (employee) => ({
          ...employee,
          disc: { dominant: payload.dominant_style, secondary: payload.secondary_style },
        })),
      ),
    );
    addNotification("Обновлён DISC-профиль", "Новая оценка DISC сохранена в профиле сотрудника.");
  };

  const submitMotivation = (payload: MotivationSubmissionRequest) => {
    setEmployees((current) =>
      current.map(
        updateEmployeeRecord(payload.employee_id, (employee) => ({
          ...employee,
          motivation: {
            motivators: payload.motivators,
            autonomyLevel: payload.autonomy_level,
            changeOrientation: payload.change_orientation,
            stressTriggers: payload.stress_triggers,
          },
        })),
      ),
    );
    addNotification("Обновлён профиль мотивации", "Результаты мотивационного опроса сохранены.");
  };

  const submitPulse = (employeeId: string, payload: PulseSubmissionRequest) => {
    const pulse = average([
      payload.mood * 20,
      (6 - payload.stress) * 20,
      (6 - payload.workload) * 20,
      payload.recognition * 20,
      payload.collaboration * 20,
    ]);

    setEmployees((current) =>
      current.map(
        updateEmployeeRecord(employeeId, (employee) => ({
          ...employee,
          pulse,
          attritionRisk: Math.max(6, payload.attrition_signal * 12),
        })),
      ),
    );
    addNotification("Pulse-опрос сохранён", "Сводка по состоянию сотрудника обновлена.");
  };

  const addIdealProfile = (payload: IdealProfileCreateRequest) => {
    setIdealProfiles((current) => [
      {
        id: crypto.randomUUID(),
        roleName: payload.role_name,
        mission: payload.mission,
        hardSkills: payload.hard_skills,
        softSkills: payload.soft_skills,
        discProfile: payload.disc_profile,
        motivators: payload.motivators,
        successCriteria: payload.success_criteria,
      },
      ...current,
    ]);
    addNotification("Создан идеальный профиль", `Профиль роли «${payload.role_name}» добавлен в библиотеку.`);
  };

  const addCandidate = (payload: CandidateCreateRequest) => {
    const matchedProfile = idealProfiles.find((profile) => profile.roleName === payload.target_role);
    const fit = buildCandidateFit(payload, matchedProfile);

    setCandidates((current) => [
      {
        id: crypto.randomUUID(),
        fullName: payload.full_name,
        targetRole: payload.target_role,
        summary: payload.summary,
        skills: payload.skills,
        fit: {
          candidate_id: crypto.randomUUID(),
          ideal_profile_id: matchedProfile?.id ?? crypto.randomUUID(),
          fit_score: fit.fit_score,
          strengths: fit.strengths,
          gaps: fit.gaps,
          recommendation: fit.recommendation,
        },
      },
      ...current,
    ]);
    addNotification("Добавлен кандидат", `Появилось новое сравнение кандидата на роль «${payload.target_role}».`);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, is_read: true } : item)),
    );
  };

  const matrix = useMemo(
    () =>
      employees.slice(0, 4).map((employee, index) => ({
        name: employee.fullName,
        performance: initialMatrix[index]?.performance ?? 70 + index * 4,
        potential: initialMatrix[index]?.potential ?? employee.growthInterest,
      })),
    [employees],
  );

  const value = useMemo(
    () => ({
      company,
      teamDashboard,
      teams,
      employees,
      idealProfiles,
      candidates,
      notifications,
      risks,
      roleMap,
      talentPool,
      successionPlan,
      matrix,
      addTeam,
      addEmployee,
      updateEmployeeProfile,
      submitDisc,
      submitMotivation,
      submitPulse,
      addIdealProfile,
      addCandidate,
      markNotificationRead,
    }),
    [teams, employees, idealProfiles, candidates, notifications, matrix],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

export const usePortal = () => {
  const value = useContext(PortalContext);
  if (!value) {
    throw new Error("Portal context is not available");
  }
  return value;
};
