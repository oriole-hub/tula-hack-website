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
  TeamDashboardResponse,
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
  notifications as initialNotifications,
  talentPool as initialTalentPool,
  teams as initialTeams,
} from "../mocks/portal";
import { useSession } from "./session";

type TeamBaseRecord = Omit<TeamRecord, "members">;
type TalentReadiness = TalentPoolItem["readiness"];

interface RiskRecord {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  reason: string;
  action: string;
}

interface PortalState {
  company: typeof company;
  teamDashboard: TeamDashboardResponse;
  teams: TeamRecord[];
  selectedTeamId: string;
  employees: EmployeeRecord[];
  idealProfiles: IdealProfileRecord[];
  candidates: CandidateRecord[];
  notifications: NotificationItem[];
  risks: RiskRecord[];
  roleMap: RoleGap[];
  talentPool: TalentPoolItem[];
  successionPlan: SuccessionItem[];
  matrix: Array<{ name: string; performance: number; potential: number }>;
  setSelectedTeamId: (teamId: string) => void;
  addTeam: (payload: TeamCreateRequest) => void;
  addEmployee: (payload: EmployeeCreateRequest & { team_id?: string }) => void;
  assignEmployeeToTeam: (employeeId: string, teamId: string) => void;
  updateEmployeeProfile: (employeeId: string, payload: EmployeeProfileUpdateRequest) => void;
  submitDisc: (payload: DiscSubmissionRequest) => void;
  submitMotivation: (payload: MotivationSubmissionRequest) => void;
  submitPulse: (employeeId: string, payload: PulseSubmissionRequest) => void;
  addIdealProfile: (payload: IdealProfileCreateRequest) => void;
  addCandidate: (payload: CandidateCreateRequest) => void;
  markNotificationRead: (notificationId: string) => void;
  saveTalentPoolEntry: (payload: { employeeId: string; readiness: TalentReadiness; nextRole: string }) => void;
  removeTalentPoolEntry: (employeeId: string) => void;
}

const PortalContext = createContext<PortalState | null>(null);

const cloneTeams = (): TeamBaseRecord[] =>
  initialTeams.map(({ members, ...team }) => ({
    ...team,
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

const createInitialTalentPool = () =>
  initialTalentPool.reduce<Record<string, { readiness: TalentReadiness; nextRole: string }>>((acc, item) => {
    acc[item.employeeId] = {
      readiness: item.readiness,
      nextRole: item.nextRole,
    };
    return acc;
  }, {});

const average = (values: number[]) =>
  values.length > 0 ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createNotification = (title: string, body: string): NotificationItem => ({
  id: crypto.randomUUID(),
  title,
  body,
  is_read: false,
  created_at: new Date().toISOString(),
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

const buildTeamMembers = (employees: EmployeeRecord[], teamId: string) =>
  employees
    .filter((employee) => employee.teamId === teamId)
    .map((employee) => ({
      employeeId: employee.id,
      fullName: employee.fullName,
      title: employee.title,
      disc: `${employee.disc.dominant}${employee.disc.secondary}`,
      performance: clamp(Math.round(employee.pulse * 0.92), 55, 96),
      potential: clamp(employee.growthInterest, 45, 98),
      pulse: employee.pulse,
    }));

const resolveTeamMaturityStage = (baseStage: string, membersCount: number) => {
  if (membersCount >= 5) {
    return "performing";
  }

  return baseStage;
};

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const { companyName, companyRegion } = useSession();
  const [teamBases, setTeamBases] = useState<TeamBaseRecord[]>(cloneTeams);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(cloneEmployees);
  const [idealProfiles, setIdealProfiles] = useState<IdealProfileRecord[]>(cloneIdealProfiles);
  const [candidates, setCandidates] = useState<CandidateRecord[]>(cloneCandidates);
  const [notifications, setNotifications] = useState<NotificationItem[]>(cloneNotifications);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeams[0]?.id ?? "");
  const [talentPoolState, setTalentPoolState] = useState<Record<string, { readiness: TalentReadiness; nextRole: string }>>(
    createInitialTalentPool,
  );

  const addNotification = (title: string, body: string) => {
    setNotifications((current) => [createNotification(title, body), ...current]);
  };

  const addTeam = (payload: TeamCreateRequest) => {
    const team: TeamBaseRecord = {
      id: crypto.randomUUID(),
      name: payload.name,
      department: payload.department,
      mission: payload.mission,
      teamType: payload.team_type,
      maturityStage: payload.maturity_stage,
    };

    setTeamBases((current) => [team, ...current]);
    addNotification("Добавлена новая команда", `Команда «${payload.name}» появилась в структуре компании.`);
  };

  const addEmployee = (payload: EmployeeCreateRequest & { team_id?: string }) => {
    const fullName = `${payload.first_name} ${payload.last_name}`.trim();
    const team = teamBases.find((item) => item.id === payload.team_id);

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
    addNotification("Добавлен новый сотрудник", `${fullName} добавлен в каталог сотрудников.`);
  };

  const assignEmployeeToTeam = (employeeId: string, teamId: string) => {
    const team = teamBases.find((item) => item.id === teamId);
    if (!team) {
      return;
    }

    setEmployees((current) =>
      current.map(
        updateEmployeeRecord(employeeId, (employee) => ({
          ...employee,
          teamId,
          department: team.department,
        })),
      ),
    );

    const employeeName = employees.find((item) => item.id === employeeId)?.fullName ?? "Сотрудник";
    addNotification("Состав команды обновлён", `${employeeName} назначен в команду «${team.name}».`);
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
    addNotification("Оценка сотрудника сохранена", "Статистика и аналитика команды обновлены на основе новой оценки.");
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

  const saveTalentPoolEntry = (payload: { employeeId: string; readiness: TalentReadiness; nextRole: string }) => {
    setTalentPoolState((current) => ({
      ...current,
      [payload.employeeId]: {
        readiness: payload.readiness,
        nextRole: payload.nextRole,
      },
    }));

    const employeeName = employees.find((item) => item.id === payload.employeeId)?.fullName ?? "Сотрудник";
    addNotification("Кадровый резерв обновлён", `${employeeName} добавлен или обновлён в кадровом резерве.`);
  };

  const removeTalentPoolEntry = (employeeId: string) => {
    setTalentPoolState((current) => {
      const next = { ...current };
      delete next[employeeId];
      return next;
    });

    const employeeName = employees.find((item) => item.id === employeeId)?.fullName ?? "Сотрудник";
    addNotification("Кадровый резерв обновлён", `${employeeName} удалён из кадрового резерва.`);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, is_read: true } : item)),
    );
  };

  const companyInfo = useMemo(
    () => ({
      ...company,
      name: companyName || company.name,
      region: companyRegion || company.region,
    }),
    [companyName, companyRegion],
  );

  const teams = useMemo<TeamRecord[]>(
    () =>
      teamBases.map((team) => {
        const members = buildTeamMembers(employees, team.id);

        return {
          ...team,
          maturityStage: resolveTeamMaturityStage(team.maturityStage, members.length),
          members,
        };
      }),
    [employees, teamBases],
  );

  const focusTeam = teams.find((team) => team.id === selectedTeamId) ?? teams[0];
  const focusTeamMembers =
    focusTeam?.members
      .map((member) => employees.find((employee) => employee.id === member.employeeId))
      .filter((employee): employee is EmployeeRecord => Boolean(employee)) ?? [];

  const matrix = useMemo(
    () =>
      (focusTeamMembers.length > 0 ? focusTeamMembers : employees.slice(0, 4)).slice(0, 4).map((employee) => ({
        name: employee.fullName,
        performance: clamp(Math.round(employee.pulse * 0.92), 55, 96),
        potential: clamp(employee.growthInterest, 45, 98),
      })),
    [employees, focusTeamMembers],
  );

  const talentPool = useMemo<TalentPoolItem[]>(
    () =>
      Object.entries(talentPoolState)
        .map(([employeeId, item]) => {
          const employee = employees.find((entry) => entry.id === employeeId);
          if (!employee) {
            return null;
          }

          return {
            employeeId,
            fullName: employee.fullName,
            readiness: item.readiness,
            score: clamp(Math.round((employee.growthInterest + employee.pulse) / 2), 55, 96),
            nextRole: item.nextRole || employee.title,
          };
        })
        .filter((item): item is TalentPoolItem => Boolean(item))
        .sort((left, right) => right.score - left.score),
    [employees, talentPoolState],
  );

  const successionPlan = useMemo<SuccessionItem[]>(
    () =>
      idealProfiles.slice(0, 3).map((profile, index) => {
        const successors = talentPool
          .filter((item) => item.score >= 70)
          .slice(index, index + 2)
          .map((item) => item.fullName);

        return {
          roleName: profile.roleName,
          currentOwner: employees[index]?.fullName ?? "Не назначен",
          successors,
          readinessScore:
            successors.length > 0
              ? average(
                  successors
                    .map((fullName) => talentPool.find((entry) => entry.fullName === fullName)?.score ?? 0)
                    .filter(Boolean),
                )
              : 0,
          gap:
            successors.length > 1
              ? "Есть готовые кандидаты в резерве, можно формировать план преемственности."
              : "Резерв пока узкий, стоит добавить сильных сотрудников в talent pool.",
        };
      }),
    [employees, idealProfiles, talentPool],
  );

  const roleMap = useMemo<RoleGap[]>(
    () =>
      idealProfiles.slice(0, 3).map((profile) => {
        const owner = employees.find((employee) =>
          employee.title.toLowerCase().includes(profile.roleName.toLowerCase().split(" ")[0].toLowerCase()),
        );

        return {
          roleName: profile.roleName,
          coverage: owner ? "full" : teams.length > 0 ? "partial" : "missing",
          owner: owner?.fullName ?? "Не назначен",
          note: owner
            ? "Роль закреплена в текущей структуре и видна в рабочем контуре."
            : "Нужен назначенный владелец роли или явный преемник внутри команды.",
        };
      }),
    [employees, idealProfiles, teams.length],
  );

  const risks = useMemo<RiskRecord[]>(
    () =>
      [...(focusTeamMembers.length > 0 ? focusTeamMembers : employees)]
        .sort((left, right) => right.attritionRisk - left.attritionRisk || left.pulse - right.pulse)
        .slice(0, 3)
        .map((employee, index) => ({
          id: `risk-${employee.id}`,
          label: `Риск по сотруднику ${employee.fullName}`,
          severity: (employee.attritionRisk >= 28 ? "high" : employee.attritionRisk >= 18 ? "medium" : "low") as
            | "low"
            | "medium"
            | "high",
          reason: `Пульс ${employee.pulse} и риск ухода ${employee.attritionRisk}% требуют внимания по нагрузке и поддержке.`,
          action:
            index === 0
              ? "Провести 1:1, проверить нагрузку и договорённости по роли."
              : "Уточнить ожидания, автономию и зону поддержки со стороны руководителя.",
        })),
    [employees, focusTeamMembers],
  );

  const teamDashboard = useMemo<TeamDashboardResponse>(() => {
    const memberPulses = focusTeamMembers.map((employee) => employee.pulse);
    const memberAttrition = focusTeamMembers.map((employee) => employee.attritionRisk);

    return {
      team_id: focusTeam?.id ?? "team",
      team_name: focusTeam?.name ?? "Команда не создана",
      health_index: average(memberPulses) || 72,
      chemistry_score: clamp(88 - Math.round((average(memberAttrition) || 12) * 0.6), 55, 92),
      conflict_risk: clamp(Math.round((average(memberAttrition) || 18) * 0.8), 8, 44),
      attrition_risk: average(memberAttrition) || 14,
      talent_pool_score: average(talentPool.map((item) => item.score)) || 70,
      succession_score: average(successionPlan.map((item) => item.readinessScore)) || 64,
      recommendations: [
        ...(focusTeamMembers.some((employee) => employee.pulse < 65)
          ? ["Поддержать сотрудников с низким pulse и сверить текущую нагрузку."]
          : ["Поддерживать ритм обратной связи и прозрачные роли внутри команды."]),
        ...(talentPool.length > 0
          ? ["Развивать сотрудников из кадрового резерва под ключевые роли."]
          : ["Добавить сотрудников в кадровый резерв и отметить high potential."]),
        "Провести 1:1 с сотрудниками из зоны повышенного риска и обновить оценку команды.",
      ],
    };
  }, [focusTeam, focusTeamMembers, successionPlan, talentPool]);

  const value = useMemo(
    () => ({
      company: companyInfo,
      teamDashboard,
      teams,
      selectedTeamId: focusTeam?.id ?? selectedTeamId,
      employees,
      idealProfiles,
      candidates,
      notifications,
      risks,
      roleMap,
      talentPool,
      successionPlan,
      matrix,
      setSelectedTeamId,
      addTeam,
      addEmployee,
      assignEmployeeToTeam,
      updateEmployeeProfile,
      submitDisc,
      submitMotivation,
      submitPulse,
      addIdealProfile,
      addCandidate,
      markNotificationRead,
      saveTalentPoolEntry,
      removeTalentPoolEntry,
    }),
    [
      candidates,
      companyInfo,
      employees,
      idealProfiles,
      matrix,
      notifications,
      risks,
      roleMap,
      selectedTeamId,
      successionPlan,
      talentPool,
      teamDashboard,
      teams,
    ],
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
