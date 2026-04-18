const dictionary: Array<[string, string]> = [
  ["Platform Growth", "Платформенный рост"],
  ["People Operations", "Операции с персоналом"],
  ["Product", "Продукт"],
  ["Engineering Manager", "Менеджер разработки"],
  ["Head of Product", "Руководитель продукта"],
  ["Senior Analyst", "Старший аналитик"],
  ["HR BP", "HR бизнес-партнер"],
  ["Recruitment Lead", "Руководитель подбора"],
  ["Lead Analyst", "Ведущий аналитик"],
  ["Recruitment Manager", "Менеджер по подбору"],
  ["Director of Engineering", "Директор по разработке"],
  ["Team Lead Platform", "Тимлид платформы"],
  ["Platform Team Lead", "Тимлид платформы"],
  ["HR Analytics Lead", "Руководитель HR-аналитики"],
  ["System Analyst", "Системный аналитик"],
  ["hybrid", "гибрид"],
  ["remote", "удаленно"],
  ["office", "офис"],
  ["ownership", "зонами ответственности"],
  ["Owner", "Владелец"],
  ["owner", "владелец"],
  ["coverage", "покрытие"],
  ["summary", "описание"],
  ["fit score", "оценка соответствия"],
  ["Fit score", "Оценка соответствия"],
  ["team dashboard", "командный дашборд"],
  ["delivery", "поставки"],
  ["workload", "нагрузки"],
  ["recognition", "признания"],
  ["people management", "управлению людьми"],
  ["Rule-based", "прозрачная"],
  ["gap-analysis", "карта дефицитов"],
  ["gap", "дефицит"],
  ["discovery", "discovery"],
];

export const toRuLabel = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return dictionary.reduce((result, [from, to]) => result.split(from).join(to), value);
};

export const initials = (value: unknown) =>
  (typeof value === "string" ? value : "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
