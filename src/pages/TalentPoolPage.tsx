import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const readinessLabels = {
  ready_now: "Готов сейчас",
  ready_6_months: "Готов через 6 месяцев",
  grow: "Нужен план развития",
} as const;

const schema = z.object({
  employee_id: z.string().min(1, "Выберите сотрудника"),
  readiness: z.enum(["ready_now", "ready_6_months", "grow"]),
  next_role: z.string().min(2, "Укажите целевую роль"),
});

type TalentPoolValues = z.infer<typeof schema>;

export const TalentPoolPage = () => {
  const { employees, talentPool, saveTalentPoolEntry, removeTalentPoolEntry } = usePortal();
  const { register, handleSubmit, reset, formState } = useForm<TalentPoolValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employee_id: employees[0]?.id ?? "",
      readiness: "ready_6_months",
      next_role: employees[0]?.title ?? "",
    },
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Кадровый резерв"
        title="Кадровый резерв и high potential"
        description="Отмечайте сотрудников с высоким потенциалом, задавайте готовность к роли и управляйте кадровым резервом в одном месте."
      />

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Управление резервом</p>
          <h2>Добавить сотрудника в talent pool</h2>
          <form
            className="inline-form"
            onSubmit={handleSubmit((values) => {
              saveTalentPoolEntry({
                employeeId: values.employee_id,
                readiness: values.readiness,
                nextRole: values.next_role,
              });
              reset({
                employee_id: employees[0]?.id ?? "",
                readiness: "ready_6_months",
                next_role: employees[0]?.title ?? "",
              });
            })}
          >
            <label className="inline-form__wide">
              <span>Сотрудник</span>
              <select {...register("employee_id")}>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {toRuLabel(employee.fullName)} · {toRuLabel(employee.title)}
                  </option>
                ))}
              </select>
              {formState.errors.employee_id ? <small>{formState.errors.employee_id.message}</small> : null}
            </label>
            <label>
              <span>Готовность</span>
              <select {...register("readiness")}>
                <option value="ready_now">Готов сейчас</option>
                <option value="ready_6_months">Готов через 6 месяцев</option>
                <option value="grow">Нужен план развития</option>
              </select>
            </label>
            <label>
              <span>Целевая роль</span>
              <input {...register("next_role")} placeholder="Следующая роль сотрудника" />
              {formState.errors.next_role ? <small>{formState.errors.next_role.message}</small> : null}
            </label>
            <Button type="submit">Сохранить в резерв</Button>
          </form>
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Как использовать</p>
          <ul className="clean-list">
            <li>Отмечайте high potential и фиксируйте готовность к следующей роли.</li>
            <li>Резерв сразу влияет на succession planning и общую аналитику по людям.</li>
            <li>Каждую запись можно обновлять или убирать из кадрового резерва.</li>
          </ul>
        </Card>
      </section>

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
              <Button type="button" variant="secondary" onClick={() => removeTalentPoolEntry(item.employeeId)}>
                Убрать
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
