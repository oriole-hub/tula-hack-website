import { usePortal } from "../shared/state/portal";
import { Button } from "../shared/ui/Button";
import { Card } from "../shared/ui/Card";
import { MetricCard } from "../shared/ui/MetricCard";
import { PageHeader } from "../shared/ui/PageHeader";
import { initials, toRuLabel } from "../shared/lib/ru";

<<<<<<< HEAD
export const DashboardPage = () => {
  const { company, matrix, risks, teamDashboard, teams } = usePortal();
=======
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalize = (value: number, min: number, max: number) => {
  if (max === min) {
    return 0.5;
  }

  return (value - min) / (max - min);
};

export const DashboardPage = () => {
  const { company, matrix, risks, teamDashboard, teams } = usePortal();
  const performanceValues = matrix.map((item) => item.performance);
  const potentialValues = matrix.map((item) => item.potential);
  const minPerformance = Math.min(...performanceValues);
  const maxPerformance = Math.max(...performanceValues);
  const minPotential = Math.min(...potentialValues);
  const maxPotential = Math.max(...potentialValues);
  const rankedNames = [...matrix]
    .sort((left, right) => right.potential + right.performance - (left.potential + left.performance))
    .map((item) => item.name);
  const clusterOffsets = [
    { x: 0, y: 10 },
    { x: 12, y: 2 },
    { x: -12, y: 0 },
    { x: 4, y: -10 },
  ];

  const displayMatrix = matrix.map((item) => {
    const label = toRuLabel(item.name);
    const performanceRatio = normalize(item.performance, minPerformance, maxPerformance);
    const potentialRatio = normalize(item.potential, minPotential, maxPotential);
    const rankIndex = Math.max(0, rankedNames.indexOf(item.name));
    const offset = clusterOffsets[rankIndex] ?? { x: 0, y: 0 };

    return {
      ...item,
      label,
      shortLabel: initials(label),
      left: clamp(64 + performanceRatio * 22, 62, 88),
      bottom: clamp(64 + potentialRatio * 22, 62, 88),
      offsetX: offset.x,
      offsetY: offset.y,
    };
  });
>>>>>>> b98eaf3 (Initial commit)

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow={`${company.name} / ${toRuLabel(company.region)}`}
        title="Командная аналитика и рекомендации"
        description="Живой срез здоровья команды, рисков и зон роста на текущий момент."
        actions={<Button>Запустить пересчёт</Button>}
      />

      <section className="metrics-row">
        <MetricCard label="Индекс здоровья" value={teamDashboard.health_index} caption="из 100" />
        <MetricCard label="Командная совместимость" value={teamDashboard.chemistry_score} caption="баллов" tone="dark" />
        <MetricCard label="Риск конфликтов" value={`${teamDashboard.conflict_risk}%`} tone="magenta" />
        <MetricCard label="Риск увольнения" value={`${teamDashboard.attrition_risk}%`} caption="по команде" />
      </section>

      <section className="two-column">
        <Card className="panel">
          <div className="panel__head">
            <div>
              <p className="panel__eyebrow">Команда</p>
              <h2>{toRuLabel(teamDashboard.team_name)}</h2>
            </div>
          </div>
          <div className="bar-list">
            {teams[0].members.map((member) => (
              <div key={member.employeeId} className="bar-list__row">
                <div>
                  <strong>{toRuLabel(member.fullName)}</strong>
                  <span>{toRuLabel(member.title)}</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${member.pulse}%` }} />
                </div>
                <b>{member.pulse}</b>
              </div>
            ))}
          </div>
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Рекомендации</p>
          <h2>Что делать дальше</h2>
          <ul className="clean-list">
            {teamDashboard.recommendations.map((item) => (
              <li key={item}>{toRuLabel(item)}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="two-column">
        <Card className="panel">
          <p className="panel__eyebrow">Результативность / потенциал</p>
          <h2>Матрица потенциала</h2>
<<<<<<< HEAD
          <div className="matrix-grid">
            {matrix.map((item) => (
              <div
                key={item.name}
                className="matrix-point"
                style={{
                  left: `${item.performance}%`,
                  bottom: `${item.potential}%`,
                }}
              >
                <span>{initials(toRuLabel(item.name))}</span>
              </div>
            ))}
=======
          <div className="matrix-wrap">
            <div className="matrix-grid__y-axis">
              <span>Высокий потенциал</span>
              <strong>Потенциал</strong>
              <span>Низкий потенциал</span>
            </div>
            <div className="matrix-grid">
              <div className="matrix-grid__label matrix-grid__label--top-left">
                <strong>Развивать</strong>
                <span>Высокий потенциал</span>
              </div>
              <div className="matrix-grid__label matrix-grid__label--top-right">
                <strong>Ключевые таланты</strong>
                <span>Высокий результат</span>
              </div>
              <div className="matrix-grid__label matrix-grid__label--bottom-left">
                <strong>Зона внимания</strong>
                <span>Нужен план роста</span>
              </div>
              <div className="matrix-grid__label matrix-grid__label--bottom-right">
                <strong>Надёжная опора</strong>
                <span>Сильная текущая отдача</span>
              </div>

              {displayMatrix.map((item) => (
                <div
                  key={item.name}
                  className="matrix-point"
                  style={{
                    left: `${item.left}%`,
                    bottom: `${item.bottom}%`,
                    ["--matrix-offset-x" as "--matrix-offset-x"]: `${item.offsetX}px`,
                    ["--matrix-offset-y" as "--matrix-offset-y"]: `${item.offsetY}px`,
                  }}
                  title={`${item.label}: результативность ${item.performance}, потенциал ${item.potential}`}
                >
                  <span>{item.shortLabel}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="matrix-grid__axis matrix-grid__axis--x">
            <span>Низкая результативность</span>
            <strong>Результативность</strong>
            <span>Высокая результативность</span>
>>>>>>> b98eaf3 (Initial commit)
          </div>
          <div className="matrix-legend">
            {matrix.map((item) => (
              <div key={item.name} className="matrix-legend__item">
<<<<<<< HEAD
                <strong>{toRuLabel(item.name)}</strong>
=======
                <div className="matrix-legend__head">
                  <span className="matrix-legend__avatar" aria-hidden="true" />
                  <strong>{toRuLabel(item.name)}</strong>
                </div>
>>>>>>> b98eaf3 (Initial commit)
                <span>Результативность {item.performance} / Потенциал {item.potential}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="panel">
          <p className="panel__eyebrow">Критичные риски</p>
          <h2>Фокус недели</h2>
          <div className="stack-list">
            {risks.slice(0, 2).map((risk) => (
              <article key={risk.id} className="stack-item">
                <strong>{toRuLabel(risk.label)}</strong>
                <p>{toRuLabel(risk.reason)}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
