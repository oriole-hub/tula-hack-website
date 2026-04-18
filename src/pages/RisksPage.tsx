import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { StatusChip } from "../shared/ui/StatusChip";
import { toRuLabel } from "../shared/lib/ru";

export const RisksPage = () => {
  const { risks } = usePortal();

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Риски"
        title="Конфликты, выгорание и риск ухода"
        description="Объяснимые сигналы с причинами и рекомендуемыми действиями для менеджера и HR."
      />

      <section className="stack-list">
        {risks.map((risk) => (
          <Card key={risk.id} className="panel risk-card">
            <div className="panel__head">
              <div>
                <p className="panel__eyebrow">Риск</p>
                <h2>{toRuLabel(risk.label)}</h2>
              </div>
              <StatusChip
                label={risk.severity === "high" ? "Высокий" : risk.severity === "medium" ? "Средний" : "Низкий"}
                tone={risk.severity === "high" ? "danger" : "accent"}
              />
            </div>
            <p className="panel__body-copy">{toRuLabel(risk.reason)}</p>
            <div className="callout">
              <strong>Следующее действие</strong>
              <span>{toRuLabel(risk.action)}</span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
