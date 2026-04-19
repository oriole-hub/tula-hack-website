import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { StatusChip } from "../shared/ui/StatusChip";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const teamSchema = z.object({
  name: z.string().min(2, "Введите название команды"),
  department: z.string().min(2, "Введите отдел"),
  mission: z.string().min(12, "Кратко опишите миссию команды"),
  team_type: z.string().min(2, "Укажите тип команды"),
  maturity_stage: z.string().min(2, "Укажите этап зрелости"),
});

type TeamFormValues = z.infer<typeof teamSchema>;

export const TeamsPage = () => {
  const { teams, employees, addTeam, assignEmployeeToTeam } = usePortal();
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<string, string>>({});
  const availableEmployees = employees.filter((employee) => employee.id && employee.fullName);
  const { register, handleSubmit, reset, formState } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_type: "кросс-функциональная",
      maturity_stage: "scaling",
    },
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Команды"
        title="Структура команд и отделов"
        description="Команды, отделы и текущая конфигурация ролей внутри рабочих контуров."
      />

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Новая команда</p>
          <h2>Добавить команду</h2>
          <form
            className="inline-form"
            onSubmit={handleSubmit((values) => {
              addTeam({
                name: values.name,
                department: values.department,
                mission: values.mission,
                team_type: values.team_type,
                maturity_stage: values.maturity_stage,
              });
              reset({
                name: "",
                department: "",
                mission: "",
                team_type: "кросс-функциональная",
                maturity_stage: "scaling",
              });
            })}
          >
            <label>
              <span>Название</span>
              <input {...register("name")} placeholder="Например, Платформенный рост" />
              {formState.errors.name ? <small>{formState.errors.name.message}</small> : null}
            </label>
            <label>
              <span>Отдел</span>
              <input {...register("department")} placeholder="Продукт" />
              {formState.errors.department ? <small>{formState.errors.department.message}</small> : null}
            </label>
            <label className="inline-form__wide">
              <span>Миссия</span>
              <textarea {...register("mission")} rows={3} placeholder="Что делает команда и за что отвечает" />
              {formState.errors.mission ? <small>{formState.errors.mission.message}</small> : null}
            </label>
            <label>
              <span>Тип команды</span>
              <input {...register("team_type")} placeholder="кросс-функциональная" />
            </label>
            <label>
              <span>Этап зрелости</span>
              <input {...register("maturity_stage")} placeholder="scaling" />
            </label>
            <Button type="submit">Сохранить команду</Button>
          </form>
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Что доступно</p>
          <ul className="clean-list">
            <li>Создание новой команды в рабочем контуре.</li>
            <li>Назначение сотрудников в нужную команду прямо из интерфейса.</li>
            <li>Состав команды сразу влияет на дашборд и командную аналитику.</li>
          </ul>
        </Card>
      </section>

      <section className="card-grid">
        {teams.map((team) => (
          <Card key={team.id} className="panel">
            <div className="panel__head">
              <div>
                <p className="panel__eyebrow">{toRuLabel(team.department)}</p>
                <h2>{toRuLabel(team.name)}</h2>
              </div>
              <StatusChip
                label={team.maturityStage === "scaling" ? "Масштабирование" : "Стабильная команда"}
                tone={team.maturityStage === "scaling" ? "accent" : "default"}
              />
            </div>
            <p className="panel__body-copy">{toRuLabel(team.mission)}</p>

            <div className="inline-form">
              <label className="inline-form__wide">
                <span>Добавить сотрудника в команду</span>
                <select
                  value={assignmentDrafts[team.id] ?? ""}
                  onChange={(event) =>
                    setAssignmentDrafts((current) => ({
                      ...current,
                      [team.id]: event.target.value,
                    }))
                  }
                >
                  <option value="">Выберите сотрудника</option>
                  {availableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {toRuLabel(employee.fullName)} · {toRuLabel(employee.title)}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                onClick={() => {
                  const employeeId = assignmentDrafts[team.id];
                  if (!employeeId) {
                    return;
                  }

                  assignEmployeeToTeam(employeeId, team.id);
                  setAssignmentDrafts((current) => ({
                    ...current,
                    [team.id]: "",
                  }));
                }}
              >
                Назначить в команду
              </Button>
            </div>

            <div className="member-list">
              {team.members.length > 0 ? (
                team.members.map((member) => (
                  <div key={member.employeeId} className="member-list__row">
                    <strong>{toRuLabel(member.fullName)}</strong>
                    <span>{toRuLabel(member.title)}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">Пока без участников. Можно начать с назначения сотрудников.</div>
              )}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
