import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { toRuLabel } from "../shared/lib/ru";

export const SuccessionPage = () => {
  const { successionPlan } = usePortal();

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Преемственность"
        title="Преемственность по критическим ролям"
        description="Индекс готовности, текущие владельцы ролей и карта дефицитов по преемникам."
      />

      <section className="card-grid">
        {successionPlan.map((item) => (
          <Card key={item.roleName} className="panel">
            <p className="panel__eyebrow">{toRuLabel(item.currentOwner)}</p>
            <h2>{toRuLabel(item.roleName)}</h2>
            <div className="detail-list">
              <div><strong>Преемники</strong><span>{item.successors.map(toRuLabel).join(", ")}</span></div>
              <div><strong>Готовность</strong><span>{item.readinessScore} / 100</span></div>
              <div><strong>Дефицит</strong><span>{toRuLabel(item.gap)}</span></div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
