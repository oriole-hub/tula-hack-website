import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { StatusChip } from "../shared/ui/StatusChip";
import { toRuLabel } from "../shared/lib/ru";

export const RoleMapPage = () => {
  const { roleMap } = usePortal();

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Карта ролей"
        title="Покрытие ролей в команде"
        description="Где есть владелец роли, где покрытие частичное, а где критичный пробел."
      />

      <section className="card-grid">
        {roleMap.map((item) => (
          <Card key={item.roleName} className="panel">
            <div className="panel__head">
              <div>
                <p className="panel__eyebrow">Роль</p>
                <h2>{toRuLabel(item.roleName)}</h2>
              </div>
              <StatusChip
                label={item.coverage === "full" ? "Закрыта" : item.coverage === "partial" ? "Частично" : "Пробел"}
                tone={item.coverage === "missing" ? "danger" : item.coverage === "partial" ? "accent" : "default"}
              />
            </div>
            <div className="detail-list">
              <div><strong>Владелец</strong><span>{toRuLabel(item.owner)}</span></div>
              <div><strong>Комментарий</strong><span>{toRuLabel(item.note)}</span></div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
