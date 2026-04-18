import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { MetricCard } from "../shared/ui/MetricCard";
import { PageHeader } from "../shared/ui/PageHeader";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const schema = z.object({
  hard_skills: z.string().min(2, "Добавьте хотя бы один hard skill"),
  soft_skills: z.string().min(2, "Добавьте хотя бы один soft skill"),
  education: z.string().min(2, "Укажите образование"),
  communication_style: z.string().min(2, "Опишите стиль коммуникации"),
  growth_interest: z.coerce.number().min(0).max(100),
  values: z.string().min(2, "Добавьте ценности"),
});

type ProfileFormValues = z.infer<typeof schema>;

export const EmployeeProfilePage = () => {
  const { employeeId } = useParams();
  const { employees, updateEmployeeProfile } = usePortal();
  const employee = useMemo(
    () => employees.find((item) => item.id === employeeId) ?? employees[0],
    [employeeId, employees],
  );

  const { register, handleSubmit, formState } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    values: {
      hard_skills: employee.skills.join(", "),
      soft_skills: employee.softSkills.join(", "),
      education: employee.education,
      communication_style: employee.communicationStyle,
      growth_interest: employee.growthInterest,
      values: employee.values.join(", "),
    },
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow={toRuLabel(employee.department)}
        title={toRuLabel(employee.fullName)}
        description={`${toRuLabel(employee.title)} · ${toRuLabel(employee.workMode)} · менеджер ${toRuLabel(employee.manager)}`}
        actions={<Link className="button button--secondary" to="/employees">Назад к списку</Link>}
      />

      <section className="metrics-row">
        <MetricCard label="Пульс" value={employee.pulse} caption="баллов" />
        <MetricCard label="Риск ухода" value={`${employee.attritionRisk}%`} tone="magenta" />
        <MetricCard label="Интерес к росту" value={employee.growthInterest} caption="из 100" tone="dark" />
        <MetricCard label="DISC" value={`${employee.disc.dominant}/${employee.disc.secondary}`} caption="профиль" />
      </section>

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Редактирование профиля</p>
          <h2>Актуализировать данные</h2>
          <form
            className="inline-form"
            onSubmit={handleSubmit((values) =>
              updateEmployeeProfile(employee.id, {
                hard_skills: values.hard_skills.split(",").map((item) => item.trim()).filter(Boolean),
                soft_skills: values.soft_skills.split(",").map((item) => item.trim()).filter(Boolean),
                education: values.education,
                communication_style: values.communication_style,
                growth_interest: values.growth_interest,
                values: values.values.split(",").map((item) => item.trim()).filter(Boolean),
              }),
            )}
          >
            <label className="inline-form__wide">
              <span>Профессиональные навыки</span>
              <textarea {...register("hard_skills")} rows={3} />
            </label>
            <label className="inline-form__wide">
              <span>Гибкие навыки</span>
              <textarea {...register("soft_skills")} rows={3} />
            </label>
            <label>
              <span>Образование</span>
              <input {...register("education")} />
            </label>
            <label>
              <span>Коммуникация</span>
              <input {...register("communication_style")} />
            </label>
            <label>
              <span>Интерес к росту</span>
              <input type="number" min="0" max="100" {...register("growth_interest")} />
            </label>
            <label>
              <span>Ценности</span>
              <input {...register("values")} />
            </label>
            <Button type="submit">Сохранить профиль</Button>
          </form>
          {Object.values(formState.errors).length > 0 ? (
            <div className="form-errors">Проверьте заполнение полей перед сохранением.</div>
          ) : null}
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Психометрия</p>
          <h2>DISC и мотивация</h2>
          <div className="detail-list detail-list--inverse">
            <div><strong>DISC</strong><span>{employee.disc.dominant} / {employee.disc.secondary}</span></div>
            <div><strong>Мотиваторы</strong><span>{employee.motivation.motivators.map(toRuLabel).join(", ")}</span></div>
            <div><strong>Стресс-триггеры</strong><span>{employee.motivation.stressTriggers.map(toRuLabel).join(", ")}</span></div>
          </div>
        </Card>
      </section>
    </div>
  );
};
