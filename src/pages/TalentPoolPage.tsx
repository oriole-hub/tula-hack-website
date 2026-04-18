import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { toRuLabel } from "../shared/lib/ru";

const readinessLabels = {
  ready_now: "Готов сейчас",
  ready_6_months: "Готов через 6 месяцев",
  grow: "Нужен план развития",
} as const;

export const TalentPoolPage = () => {
  const { talentPool } = usePortal();

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Кадровый резерв"
        title="Кадровый резерв и high potential"
        description="Кто готов сейчас, кто выйдет на роль через 6 месяцев и где нужен план развития."
      />

      <Card className="panel">
        <div className="table-like">
          {talentPool.map((item) => (
            <div key={item.employeeId} className="table-like__row">
              <div>
                <strong>{toRuLabel(item.fullName)}</strong>
                <span>{toRuLabel(item.nextRole)}</span>
              </div>
              <span>{readinessLabels[item.readiness]}</span>
              <b>{item.score}</b>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
