import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const discSchema = z.object({
  employee_id: z.string().min(1),
  dominant_style: z.enum(["D", "I", "S", "C"]),
  secondary_style: z.enum(["D", "I", "S", "C"]),
  notes: z.string().min(2),
});

const motivationSchema = z.object({
  employee_id: z.string().min(1),
  motivators: z.string().min(2),
  autonomy_level: z.coerce.number().min(1).max(10),
  change_orientation: z.coerce.number().min(1).max(10),
  stress_triggers: z.string().min(2),
});

const pulseSchema = z.object({
  employee_id: z.string().min(1),
  mood: z.coerce.number().min(1).max(5),
  stress: z.coerce.number().min(1).max(5),
  workload: z.coerce.number().min(1).max(5),
  recognition: z.coerce.number().min(1).max(5),
  collaboration: z.coerce.number().min(1).max(5),
  attrition_signal: z.coerce.number().min(1).max(5),
  comment: z.string().min(2),
});

export const AssessmentsPage = () => {
  const { employees, submitDisc, submitMotivation, submitPulse } = usePortal();
  const defaultEmployeeId = employees[0]?.id ?? "";

  const discForm = useForm<z.infer<typeof discSchema>>({
    resolver: zodResolver(discSchema),
    defaultValues: { employee_id: defaultEmployeeId, dominant_style: "D", secondary_style: "I", notes: "Стабильный лидерский профиль" },
  });
  const motivationForm = useForm<z.infer<typeof motivationSchema>>({
    resolver: zodResolver(motivationSchema),
    defaultValues: { employee_id: defaultEmployeeId, motivators: "влияние, рост", autonomy_level: 8, change_orientation: 7, stress_triggers: "неясные ожидания" },
  });
  const pulseForm = useForm<z.infer<typeof pulseSchema>>({
    resolver: zodResolver(pulseSchema),
    defaultValues: { employee_id: defaultEmployeeId, mood: 4, stress: 2, workload: 3, recognition: 4, collaboration: 4, attrition_signal: 1, comment: "Рабочая неделя прошла стабильно" },
  });

  const hottestPulse = useMemo(() => [...employees].sort((a, b) => a.pulse - b.pulse).slice(0, 3), [employees]);

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Оценки"
        title="DISC, мотивация и pulse"
        description="Все ключевые сценарии оценки доступны прямо в рабочем контуре и сразу влияют на профиль сотрудника."
      />

      <section className="three-column three-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">DISC</p>
          <h2>Отправить профиль</h2>
          <form
            className="inline-form"
            onSubmit={discForm.handleSubmit((values) =>
              submitDisc({
                employee_id: values.employee_id,
                dominant_style: values.dominant_style,
                secondary_style: values.secondary_style,
                notes: values.notes,
              }),
            )}
          >
            <label>
              <span>Сотрудник</span>
              <select {...discForm.register("employee_id")}>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {toRuLabel(employee.fullName)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Основной стиль</span>
              <select {...discForm.register("dominant_style")}>
                {["D", "I", "S", "C"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Вторичный стиль</span>
              <select {...discForm.register("secondary_style")}>
                {["D", "I", "S", "C"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="inline-form__wide">
              <span>Комментарий</span>
              <textarea {...discForm.register("notes")} rows={3} />
            </label>
            <Button type="submit">Сохранить DISC</Button>
          </form>
        </Card>

        <Card className="panel panel--magenta">
          <p className="panel__eyebrow">Мотивация</p>
          <h2>Обновить мотиваторы</h2>
          <form
            className="inline-form inline-form--inverse"
            onSubmit={motivationForm.handleSubmit((values) =>
              submitMotivation({
                employee_id: values.employee_id,
                autonomy_level: values.autonomy_level,
                change_orientation: values.change_orientation,
                motivators: values.motivators.split(",").map((item) => item.trim()).filter(Boolean),
                stress_triggers: values.stress_triggers.split(",").map((item) => item.trim()).filter(Boolean),
              }),
            )}
          >
            <label>
              <span>Сотрудник</span>
              <select {...motivationForm.register("employee_id")}>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {toRuLabel(employee.fullName)}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-form__wide">
              <span>Мотиваторы</span>
              <input {...motivationForm.register("motivators")} />
            </label>
            <label>
              <span>Автономия</span>
              <input type="number" min="1" max="10" {...motivationForm.register("autonomy_level")} />
            </label>
            <label>
              <span>Ориентация на изменения</span>
              <input type="number" min="1" max="10" {...motivationForm.register("change_orientation")} />
            </label>
            <label className="inline-form__wide">
              <span>Стресс-триггеры</span>
              <input {...motivationForm.register("stress_triggers")} />
            </label>
            <Button type="submit" variant="secondary">Сохранить мотивацию</Button>
          </form>
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Pulse</p>
          <h2>Обновить состояние</h2>
          <form
            className="inline-form inline-form--inverse"
            onSubmit={pulseForm.handleSubmit((values) =>
              submitPulse(values.employee_id, {
                mood: values.mood,
                stress: values.stress,
                workload: values.workload,
                recognition: values.recognition,
                collaboration: values.collaboration,
                attrition_signal: values.attrition_signal,
                comment: values.comment,
              }),
            )}
          >
            <label>
              <span>Сотрудник</span>
              <select {...pulseForm.register("employee_id")}>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {toRuLabel(employee.fullName)}
                  </option>
                ))}
              </select>
            </label>
            <label><span>Настроение</span><input type="number" min="1" max="5" {...pulseForm.register("mood")} /></label>
            <label><span>Стресс</span><input type="number" min="1" max="5" {...pulseForm.register("stress")} /></label>
            <label><span>Нагрузка</span><input type="number" min="1" max="5" {...pulseForm.register("workload")} /></label>
            <label><span>Признание</span><input type="number" min="1" max="5" {...pulseForm.register("recognition")} /></label>
            <label><span>Взаимодействие</span><input type="number" min="1" max="5" {...pulseForm.register("collaboration")} /></label>
            <label><span>Сигнал ухода</span><input type="number" min="1" max="5" {...pulseForm.register("attrition_signal")} /></label>
            <label className="inline-form__wide">
              <span>Комментарий</span>
              <textarea {...pulseForm.register("comment")} rows={3} />
            </label>
            <Button type="submit" variant="ghost">Сохранить pulse</Button>
          </form>
        </Card>
      </section>

      <Card className="panel">
        <p className="panel__eyebrow">Зона внимания</p>
        <h2>Кому нужен фокус сейчас</h2>
        <div className="stack-list">
          {hottestPulse.map((employee) => (
            <article key={employee.id} className="stack-item">
              <strong>{toRuLabel(employee.fullName)}</strong>
              <p>Пульс {employee.pulse}, риск ухода {employee.attritionRisk}%.</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
};
