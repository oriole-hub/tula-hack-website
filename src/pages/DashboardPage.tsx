import { usePortal } from "../shared/state/portal";
import { Button } from "../shared/ui/Button";
import { Card } from "../shared/ui/Card";
import { MetricCard } from "../shared/ui/MetricCard";
import { PageHeader } from "../shared/ui/PageHeader";
import { initials, toRuLabel } from "../shared/lib/ru";

export const DashboardPage = () => {
  const { company, matrix, risks, teamDashboard, teams } = usePortal();

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
          </div>
          <div className="matrix-legend">
            {matrix.map((item) => (
              <div key={item.name} className="matrix-legend__item">
                <strong>{toRuLabel(item.name)}</strong>
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
