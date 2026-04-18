import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { StatusChip } from "../shared/ui/StatusChip";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

export const NotificationsPage = () => {
  const { notifications, markNotificationRead } = usePortal();

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Уведомления"
        title="Сигналы и входящие события"
        description="Напоминания по pulse, аналитические обновления и события по сравнению кандидатов."
      />

      <section className="stack-list">
        {notifications.map((item) => (
          <Card key={item.id} className="panel">
            <div className="panel__head">
              <div>
                <p className="panel__eyebrow">{new Date(item.created_at).toLocaleDateString("ru-RU")}</p>
                <h2>{toRuLabel(item.title)}</h2>
              </div>
              <StatusChip label={item.is_read ? "Прочитано" : "Новое"} tone={item.is_read ? "default" : "accent"} />
            </div>
            <p className="panel__body-copy">{toRuLabel(item.body)}</p>
            {!item.is_read ? <Button variant="secondary" onClick={() => markNotificationRead(item.id)}>Отметить как прочитанное</Button> : null}
          </Card>
        ))}
      </section>
    </div>
  );
};
