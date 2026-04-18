import {
  CandidateFitResponse,
  NotificationItem,
  Role,
  TeamDashboardResponse,
  TeamRiskItem,
} from "../api/contracts";

export interface CompanyInfo {
  id: string;
  name: string;
  industry: string;
  size: string;
  region: string;
}

export interface TeamMember {
  employeeId: string;
  fullName: string;
  title: string;
  disc: string;
  performance: number;
  potential: number;
  pulse: number;
}

export interface TeamRecord {
  id: string;
  name: string;
  department: string;
  mission: string;
  teamType: string;
  maturityStage: string;
  members: TeamMember[];
}

export interface EmployeeRecord {
  id: string;
  fullName: string;
  role: Role;
  title: string;
  department: string;
  teamId: string;
  manager: string;
  workMode: string;
  tenureMonths: number;
  pulse: number;
  attritionRisk: number;
  skills: string[];
  softSkills: string[];
  education: string;
  communicationStyle: string;
  growthInterest: number;
  values: string[];
  disc: {
    dominant: string;
    secondary: string;
  };
  motivation: {
    motivators: string[];
    autonomyLevel: number;
    changeOrientation: number;
    stressTriggers: string[];
  };
}

export interface IdealProfileRecord {
  id: string;
  roleName: string;
  mission: string;
  hardSkills: string[];
  softSkills: string[];
  discProfile: string[];
  motivators: string[];
  successCriteria: string[];
}

export interface CandidateRecord {
  id: string;
  fullName: string;
  targetRole: string;
  summary: string;
  skills: string[];
  fit: CandidateFitResponse;
}

export interface RoleGap {
  roleName: string;
  coverage: "full" | "partial" | "missing";
  owner: string;
  note: string;
}

export interface TalentPoolItem {
  employeeId: string;
  fullName: string;
  readiness: "ready_now" | "ready_6_months" | "grow";
  score: number;
  nextRole: string;
}

export interface SuccessionItem {
  roleName: string;
  currentOwner: string;
  successors: string[];
  readinessScore: number;
  gap: string;
}

export const company: CompanyInfo = {
  id: "f036c1fc-e202-4b39-b0b5-8184c8cbd8f4",
  name: "TEAM BUILDER",
  industry: "HR Tech",
  size: "201-500",
  region: "Москва",
};

export const teamDashboard: TeamDashboardResponse = {
  team_id: "c316f472-b4b8-416a-ae33-dcb58f43170c",
  team_name: "Платформенный рост",
  health_index: 82,
  chemistry_score: 76,
  conflict_risk: 24,
  attrition_risk: 18,
  talent_pool_score: 71,
  succession_score: 63,
  recommendations: [
    "Снять перегрузку с аналитиков и перераспределить discovery-задачи.",
    "Провести 1:1 с двумя ключевыми сотрудниками из зоны выгорания.",
    "Усилить внутренний кадровый резерв на роль тимлида платформы.",
  ],
};

export const teams: TeamRecord[] = [
  {
    id: "c316f472-b4b8-416a-ae33-dcb58f43170c",
    name: "Платформенный рост",
    department: "Продукт",
    mission: "Развивать ключевую платформу продукта и удерживать качество доставки.",
    teamType: "кросс-функциональная",
    maturityStage: "scaling",
    members: [
      {
        employeeId: "emp-1",
        fullName: "Анастасия Белова",
        title: "Руководитель продукта",
        disc: "DI",
        performance: 88,
        potential: 91,
        pulse: 72,
      },
      {
        employeeId: "emp-2",
        fullName: "Игорь Серов",
        title: "Менеджер разработки",
        disc: "CS",
        performance: 84,
        potential: 79,
        pulse: 68,
      },
      {
        employeeId: "emp-3",
        fullName: "Мария Колосова",
        title: "Старший аналитик",
        disc: "SC",
        performance: 79,
        potential: 86,
        pulse: 61,
      },
    ],
  },
  {
    id: "team-2",
    name: "Операции с персоналом",
    department: "HR",
    mission: "Улучшать процессы найма, адаптации и развития сотрудников.",
    teamType: "функциональная",
    maturityStage: "performing",
    members: [
      {
        employeeId: "emp-4",
        fullName: "Елена Миронова",
        title: "HR бизнес-партнер",
        disc: "IS",
        performance: 82,
        potential: 84,
        pulse: 77,
      },
      {
        employeeId: "emp-5",
        fullName: "Кирилл Андреев",
        title: "Руководитель подбора",
        disc: "DI",
        performance: 81,
        potential: 74,
        pulse: 73,
      },
    ],
  },
];

export const employees: EmployeeRecord[] = [
  {
    id: "emp-1",
    fullName: "Анастасия Белова",
    role: "company_admin",
    title: "Руководитель продукта",
    department: "Продукт",
    teamId: "c316f472-b4b8-416a-ae33-dcb58f43170c",
    manager: "CEO",
    workMode: "гибрид",
    tenureMonths: 34,
    pulse: 72,
    attritionRisk: 12,
    skills: ["Продуктовая стратегия", "Лидерство", "Дорожная карта"],
    softSkills: ["Ответственность", "Фасилитация", "Коммуникация"],
    education: "НИУ ВШЭ",
    communicationStyle: "прямой и партнёрский",
    growthInterest: 82,
    values: ["влияние", "скорость", "прозрачность"],
    disc: { dominant: "D", secondary: "I" },
    motivation: {
      motivators: ["влияние", "автономия", "сложные задачи"],
      autonomyLevel: 9,
      changeOrientation: 8,
      stressTriggers: ["неопределённость ролей", "затяжные согласования"],
    },
  },
  {
    id: "emp-2",
    fullName: "Игорь Серов",
    role: "manager",
    title: "Менеджер разработки",
    department: "Продукт",
    teamId: "c316f472-b4b8-416a-ae33-dcb58f43170c",
    manager: "Анастасия Белова",
    workMode: "удаленно",
    tenureMonths: 26,
    pulse: 68,
    attritionRisk: 18,
    skills: ["Управление командой", "Поставка", "Архитектура"],
    softSkills: ["Системное мышление", "Наставничество", "Переговоры"],
    education: "СПбГУ",
    communicationStyle: "структурный",
    growthInterest: 76,
    values: ["качество", "команда", "стабильность"],
    disc: { dominant: "C", secondary: "S" },
    motivation: {
      motivators: ["качество решений", "команда", "ясные договорённости"],
      autonomyLevel: 7,
      changeOrientation: 6,
      stressTriggers: ["рывки в приоритетах", "неполные вводные"],
    },
  },
  {
    id: "emp-3",
    fullName: "Мария Колосова",
    role: "employee",
    title: "Старший аналитик",
    department: "Продукт",
    teamId: "c316f472-b4b8-416a-ae33-dcb58f43170c",
    manager: "Игорь Серов",
    workMode: "офис",
    tenureMonths: 18,
    pulse: 61,
    attritionRisk: 31,
    skills: ["SQL", "BI", "Исследования"],
    softSkills: ["Точность", "Эмпатия", "Презентация"],
    education: "РЭУ им. Плеханова",
    communicationStyle: "аккуратный аналитический",
    growthInterest: 88,
    values: ["развитие", "понятность", "уважение"],
    disc: { dominant: "S", secondary: "C" },
    motivation: {
      motivators: ["рост", "обучение", "экспертность"],
      autonomyLevel: 6,
      changeOrientation: 7,
      stressTriggers: ["перегрузка", "отсутствие признания"],
    },
  },
  {
    id: "emp-4",
    fullName: "Елена Миронова",
    role: "hr",
    title: "HR бизнес-партнер",
    department: "HR",
    teamId: "team-2",
    manager: "COO",
    workMode: "гибрид",
    tenureMonths: 29,
    pulse: 77,
    attritionRisk: 11,
    skills: ["Управление талантами", "HR-аналитика", "Фасилитация"],
    softSkills: ["Доверие", "Коучинг", "Влияние"],
    education: "МГУ",
    communicationStyle: "поддерживающий",
    growthInterest: 74,
    values: ["люди", "смысл", "развитие"],
    disc: { dominant: "I", secondary: "S" },
    motivation: {
      motivators: ["помощь людям", "улучшения", "доверие"],
      autonomyLevel: 8,
      changeOrientation: 7,
      stressTriggers: ["конфликты без фасилитации", "перегрузка коммуникацией"],
    },
  },
  {
    id: "emp-5",
    fullName: "Кирилл Андреев",
    role: "employee",
    title: "Руководитель подбора",
    department: "HR",
    teamId: "team-2",
    manager: "Елена Миронова",
    workMode: "гибрид",
    tenureMonths: 15,
    pulse: 73,
    attritionRisk: 16,
    skills: ["Подбор", "Дизайн интервью", "Бренд работодателя"],
    softSkills: ["Скорость", "Убеждение", "Нетворкинг"],
    education: "РАНХиГС",
    communicationStyle: "энергичный",
    growthInterest: 80,
    values: ["результат", "ритм", "влияние"],
    disc: { dominant: "D", secondary: "I" },
    motivation: {
      motivators: ["результат", "скорость", "видимый эффект"],
      autonomyLevel: 8,
      changeOrientation: 9,
      stressTriggers: ["длинные циклы", "неопределённые критерии"],
    },
  },
];

export const idealProfiles: IdealProfileRecord[] = [
  {
    id: "ideal-1",
    roleName: "Тимлид платформы",
    mission: "Вести платформенную команду к предсказуемой поставке и росту качества.",
    hardSkills: ["Поставка", "Системный дизайн", "Управление людьми"],
    softSkills: ["Ответственность", "Наставничество", "Переговоры"],
    discProfile: ["D", "C"],
    motivators: ["автономия", "влияние", "сложные задачи"],
    successCriteria: ["низкий time-to-decision", "стабильная delivery velocity"],
  },
  {
    id: "ideal-2",
    roleName: "Руководитель HR-аналитики",
    mission: "Построить прозрачную аналитику по людям и кадровому резерву.",
    hardSkills: ["HR-аналитика", "SQL", "Дашборды"],
    softSkills: ["Системное мышление", "Ясность", "Презентация выводов"],
    discProfile: ["C", "S"],
    motivators: ["экспертность", "ясность", "польза бизнесу"],
    successCriteria: ["доверие к данным", "прозрачность решений"],
  },
];

export const candidates: CandidateRecord[] = [
  {
    id: "cand-1",
    fullName: "Софья Лебедева",
    targetRole: "Тимлид платформы",
    summary: "Руководила платформенной командой из 9 человек, запускала процессы delivery planning.",
    skills: ["Архитектура", "Лидерство", "Agile", "Подбор"],
    fit: {
      candidate_id: "cand-1",
      ideal_profile_id: "ideal-1",
      fit_score: 91,
      strengths: ["сильный leadership fit", "релевантный опыт delivery", "устойчивый DISC-профиль"],
      gaps: ["нужно усилить telecom domain knowledge"],
      recommendation: "Выводить в финальный круг на оценку команды и культурного совпадения.",
    },
  },
  {
    id: "cand-2",
    fullName: "Олег Дмитриев",
    targetRole: "Руководитель HR-аналитики",
    summary: "Развивал HR-дашборды и аналитические модели в международной компании.",
    skills: ["SQL", "Power BI", "Исследования", "Партнерство с HR BP"],
    fit: {
      candidate_id: "cand-2",
      ideal_profile_id: "ideal-2",
      fit_score: 84,
      strengths: ["сильная аналитика", "внятная коммуникация с бизнесом"],
      gaps: ["ниже опыт построения succession процессов"],
      recommendation: "Подходит для этапа кейса и обсуждения HR roadmap.",
    },
  },
];

export const risks: TeamRiskItem[] = [
  {
    id: "risk-1",
    label: "Конфликт ролей в Platform Growth",
    severity: "high",
    reason: "Пересечение ownership между аналитикой и delivery внутри платформенной команды.",
    action: "Зафиксировать владельцев discovery и delivery в спринтовом ритуале.",
  },
  {
    id: "risk-2",
    label: "Риск выгорания Senior Analyst",
    severity: "medium",
    reason: "Две недели роста workload и падение recognition в pulse-опросах.",
    action: "Сократить поток ad-hoc задач и назначить регулярную обратную связь.",
  },
  {
    id: "risk-3",
    label: "Риск ухода ключевого тимлида",
    severity: "medium",
    reason: "Высокий запрос на автономию при нехватке делегирования.",
    action: "Обсудить персональный growth path и расширение зоны влияния.",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "not-1",
    title: "Pulse-опрос не завершён",
    body: "Ещё 12 сотрудников не закрыли pulse-опрос этой недели.",
    is_read: false,
    created_at: "2026-04-18T08:30:00Z",
  },
  {
    id: "not-2",
    title: "Готов новый team dashboard",
    body: "Rule-based аналитика для Platform Growth пересчитана на актуальных данных.",
    is_read: false,
    created_at: "2026-04-18T06:15:00Z",
  },
  {
    id: "not-3",
    title: "Открыт новый кандидатный fit",
    body: "По роли Team Lead Platform доступно новое сравнение кандидата.",
    is_read: true,
    created_at: "2026-04-17T17:40:00Z",
  },
];

export const roleMap: RoleGap[] = [
  {
    roleName: "Тимлид платформы",
    coverage: "partial",
    owner: "Игорь Серов",
    note: "Сильная delivery часть, но перегрузка по people management.",
  },
  {
    roleName: "Системный аналитик",
    coverage: "missing",
    owner: "—",
    note: "Критический gap на фоне роста discovery-нагрузки.",
  },
  {
    roleName: "Руководитель HR-аналитики",
    coverage: "full",
    owner: "Елена Миронова",
    note: "Роль закрыта, требуется поддержка преемника.",
  },
];

export const talentPool: TalentPoolItem[] = [
  {
    employeeId: "emp-3",
    fullName: "Мария Колосова",
    readiness: "ready_6_months",
    score: 82,
    nextRole: "Ведущий аналитик",
  },
  {
    employeeId: "emp-5",
    fullName: "Кирилл Андреев",
    readiness: "ready_now",
    score: 86,
    nextRole: "Менеджер по подбору",
  },
  {
    employeeId: "emp-2",
    fullName: "Игорь Серов",
    readiness: "grow",
    score: 74,
    nextRole: "Директор по разработке",
  },
];

export const successionPlan: SuccessionItem[] = [
  {
    roleName: "Руководитель продукта",
    currentOwner: "Анастасия Белова",
    successors: ["Игорь Серов", "Мария Колосова"],
    readinessScore: 63,
    gap: "Нужен более явный people-management трек у внутренних кандидатов.",
  },
  {
    roleName: "Руководитель HR BP",
    currentOwner: "Елена Миронова",
    successors: ["Кирилл Андреев"],
    readinessScore: 71,
    gap: "Требуется усилить аналитическую экспертизу преемника.",
  },
];

export const matrix = [
  { name: "Анастасия Белова", performance: 88, potential: 91 },
  { name: "Игорь Серов", performance: 84, potential: 79 },
  { name: "Мария Колосова", performance: 79, potential: 86 },
  { name: "Елена Миронова", performance: 82, potential: 84 },
];
