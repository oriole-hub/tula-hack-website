import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { StatusChip } from "../shared/ui/StatusChip";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const schema = z.object({
  first_name: z.string().min(2, "Введите имя"),
  last_name: z.string().min(2, "Введите фамилию"),
  email: z.string().email("Введите корректный email"),
  title: z.string().min(2, "Введите должность"),
  department: z.string().min(2, "Введите отдел"),
  manager_id: z.string().min(1, "Выберите менеджера"),
  tenure_months: z.coerce.number().min(0, "Стаж не может быть отрицательным"),
  work_mode: z.string().min(2, "Укажите формат работы"),
  team_id: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof schema>;

export const EmployeesPage = () => {
  const { employees, teams, addEmployee } = usePortal();
  const managerOptions = employees.filter((employee) => employee?.id && employee?.fullName);
  const employeeRows = employees.filter((employee) => employee?.id);
  const { register, handleSubmit, reset, formState } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      work_mode: "гибрид",
      tenure_months: 6,
      manager_id: managerOptions[0]?.id ?? "",
      team_id: teams[0]?.id ?? "",
    },
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Сотрудники"
        title="Каталог сотрудников"
        description="Профили, роли, pulse-сигналы и контекст развития для каждой ключевой персоны."
      />

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Новый сотрудник</p>
          <h2>Добавить в каталог</h2>
          <form
            className="inline-form inline-form--compact"
            onSubmit={handleSubmit((values) => {
              addEmployee({
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                title: values.title,
                department: values.department,
                manager_id: values.manager_id,
                tenure_months: values.tenure_months,
                work_mode: values.work_mode,
                team_id: values.team_id,
              });
              reset({
                first_name: "",
                last_name: "",
                email: "",
                title: "",
                department: "",
                manager_id: managerOptions[0]?.id ?? "",
                tenure_months: 6,
                work_mode: "гибрид",
                team_id: teams[0]?.id ?? "",
              });
            })}
          >
            <label>
              <span>Имя</span>
              <input {...register("first_name")} />
              {formState.errors.first_name ? <small>{formState.errors.first_name.message}</small> : null}
            </label>
            <label>
              <span>Фамилия</span>
              <input {...register("last_name")} />
              {formState.errors.last_name ? <small>{formState.errors.last_name.message}</small> : null}
            </label>
            <label>
              <span>Эл. почта</span>
              <input {...register("email")} />
              {formState.errors.email ? <small>{formState.errors.email.message}</small> : null}
            </label>
            <label>
              <span>Должность</span>
              <input {...register("title")} />
              {formState.errors.title ? <small>{formState.errors.title.message}</small> : null}
            </label>
            <label>
              <span>Отдел</span>
              <input {...register("department")} />
              {formState.errors.department ? <small>{formState.errors.department.message}</small> : null}
            </label>
            <label>
              <span>Менеджер</span>
              <select {...register("manager_id")}>
                {managerOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {toRuLabel(employee.fullName)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Стаж, мес.</span>
              <input type="number" {...register("tenure_months")} />
            </label>
            <label>
              <span>Формат работы</span>
              <input {...register("work_mode")} placeholder="гибрид" />
            </label>
            <label>
              <span>Команда</span>
              <select {...register("team_id")}>
                <option value="">Без команды</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {toRuLabel(team.name)}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">Добавить сотрудника</Button>
          </form>
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Как это работает</p>
          <ul className="clean-list">
            <li>Карточки ведут в профиль сотрудника с редактируемыми данными, DISC и мотивацией.</li>
            <li>Добавленные сотрудники сразу появляются в каталоге, командах и аналитических разделах.</li>
            <li>Каталог помогает быстро собрать рабочую структуру людей и ролей внутри компании.</li>
          </ul>
        </Card>
      </section>

      <Card className="panel">
        <div className="table-like">
          {employeeRows.map((employee) => (
            <Link key={employee.id} className="table-like__row" to={`/employees/${employee.id}`}>
              <div>
                <strong>{toRuLabel(employee.fullName)}</strong>
                <span>{toRuLabel(employee.title)}</span>
              </div>
              <span>{toRuLabel(employee.department)}</span>
              <span>{toRuLabel(employee.workMode)}</span>
              <StatusChip label={`Пульс ${employee.pulse}`} tone={employee.pulse < 65 ? "danger" : "default"} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
