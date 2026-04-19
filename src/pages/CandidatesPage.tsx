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
  full_name: z.string().min(3, "Введите имя кандидата"),
  email: z.string().email("Введите корректный email"),
  target_role: z.string().min(2, "Укажите целевую роль"),
  summary: z.string().min(12, "Добавьте краткое описание опыта"),
  skills: z.string().min(2, "Добавьте навыки"),
});

type CandidateValues = z.infer<typeof schema>;

export const CandidatesPage = () => {
  const { candidates, idealProfiles, addCandidate } = usePortal();
  const { register, handleSubmit, reset, formState } = useForm<CandidateValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      target_role: idealProfiles[0]?.roleName ?? "",
    },
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Кандидаты"
        title="Сравнение кандидатов с идеальным профилем"
        description="Резюме, описание опыта, оценка соответствия и ключевые зоны расхождения по роли."
      />

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Новый кандидат</p>
          <h2>Запустить сравнение</h2>
          <form
            className="inline-form"
            onSubmit={handleSubmit((values) => {
              addCandidate({
                full_name: values.full_name,
                email: values.email,
                target_role: values.target_role,
                summary: values.summary,
                skills: values.skills.split(",").map((item) => item.trim()).filter(Boolean),
              });
              reset({ full_name: "", email: "", target_role: idealProfiles[0]?.roleName ?? "", summary: "", skills: "" });
            })}
          >
            <label><span>ФИО</span><input {...register("full_name")} /></label>
            <label><span>Эл. почта</span><input {...register("email")} /></label>
            <label className="inline-form__wide">
              <span>Целевая роль</span>
              <select {...register("target_role")}>
                {idealProfiles.map((profile) => (
                  <option key={profile.id} value={profile.roleName}>
                    {toRuLabel(profile.roleName)}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-form__wide"><span>Краткое описание</span><textarea {...register("summary")} rows={3} /></label>
            <label className="inline-form__wide"><span>Навыки</span><input {...register("skills")} /></label>
            <Button type="submit">Добавить кандидата</Button>
          </form>
          {Object.values(formState.errors).length > 0 ? <div className="form-errors">Проверьте обязательные поля кандидата.</div> : null}
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Результат сравнения</p>
          <ul className="clean-list">
            <li>Оценка строится на совпадении hard skills и описания роли.</li>
            <li>Результат сохраняется в каталоге и виден сразу в карточке.</li>
            <li>Сравнение помогает быстро понять сильные стороны кандидата и зоны внимания.</li>
          </ul>
        </Card>
      </section>

      <section className="card-grid">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="panel">
            <p className="panel__eyebrow">{toRuLabel(candidate.targetRole)}</p>
            <h2>{toRuLabel(candidate.fullName)}</h2>
            <p className="panel__body-copy">{toRuLabel(candidate.summary)}</p>
            <div className="metrics-row metrics-row--embedded">
              <MetricCard label="Оценка соответствия" value={`${candidate.fit.fit_score}%`} tone="magenta" />
            </div>
            <div className="detail-list">
              <div><strong>Сильные стороны</strong><span>{candidate.fit.strengths.map(toRuLabel).join(", ")}</span></div>
              <div><strong>Дефициты</strong><span>{candidate.fit.gaps.map(toRuLabel).join(", ")}</span></div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
