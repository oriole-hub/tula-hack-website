import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePortal } from "../shared/state/portal";
import { Card } from "../shared/ui/Card";
import { PageHeader } from "../shared/ui/PageHeader";
import { Button } from "../shared/ui/Button";
import { toRuLabel } from "../shared/lib/ru";

const schema = z.object({
  role_name: z.string().min(2, "Введите роль"),
  mission: z.string().min(12, "Опишите назначение роли"),
  hard_skills: z.string().min(2, "Добавьте hard skills"),
  soft_skills: z.string().min(2, "Добавьте soft skills"),
  disc_profile: z.string().min(1, "Укажите DISC"),
  motivators: z.string().min(2, "Добавьте мотиваторы"),
  success_criteria: z.string().min(2, "Добавьте критерии успеха"),
});

type IdealProfileValues = z.infer<typeof schema>;

export const IdealProfilesPage = () => {
  const { idealProfiles, addIdealProfile } = usePortal();
  const { register, handleSubmit, reset, formState } = useForm<IdealProfileValues>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Идеальный профиль"
        title="Эталонные профили ролей"
        description="Шаблоны идеальных ролей для найма, внутреннего роста и оценки соответствия."
      />

      <section className="two-column two-column--top">
        <Card className="panel">
          <p className="panel__eyebrow">Новый профиль</p>
          <h2>Добавить роль</h2>
          <form
            className="inline-form"
            onSubmit={handleSubmit((values) => {
              addIdealProfile({
                role_name: values.role_name,
                mission: values.mission,
                hard_skills: values.hard_skills.split(",").map((item) => item.trim()).filter(Boolean),
                soft_skills: values.soft_skills.split(",").map((item) => item.trim()).filter(Boolean),
                disc_profile: values.disc_profile.split(",").map((item) => item.trim()).filter(Boolean),
                motivators: values.motivators.split(",").map((item) => item.trim()).filter(Boolean),
                success_criteria: values.success_criteria.split(",").map((item) => item.trim()).filter(Boolean),
              });
              reset();
            })}
          >
            <label><span>Роль</span><input {...register("role_name")} /></label>
            <label className="inline-form__wide"><span>Миссия</span><textarea {...register("mission")} rows={3} /></label>
            <label className="inline-form__wide"><span>Профессиональные навыки</span><input {...register("hard_skills")} /></label>
            <label className="inline-form__wide"><span>Гибкие навыки</span><input {...register("soft_skills")} /></label>
            <label><span>DISC</span><input {...register("disc_profile")} placeholder="D, C" /></label>
            <label><span>Мотиваторы</span><input {...register("motivators")} /></label>
            <label className="inline-form__wide"><span>Критерии успеха</span><input {...register("success_criteria")} /></label>
            <Button type="submit">Сохранить профиль</Button>
          </form>
          {Object.values(formState.errors).length > 0 ? <div className="form-errors">Заполните все обязательные поля профиля.</div> : null}
        </Card>

        <Card className="panel panel--dark">
          <p className="panel__eyebrow">Как используется</p>
          <ul className="clean-list">
            <li>Профиль участвует в сравнении кандидатов и внутреннего резерва.</li>
            <li>Все ключевые параметры роли собраны в одном месте и легко обновляются.</li>
            <li>Профиль можно использовать как основу для найма, оценки и развития.</li>
          </ul>
        </Card>
      </section>

      <section className="card-grid">
        {idealProfiles.map((profile) => (
          <Card key={profile.id} className="panel">
            <p className="panel__eyebrow">{toRuLabel(profile.roleName)}</p>
            <h2>{toRuLabel(profile.mission)}</h2>
            <div className="detail-list">
              <div><strong>Профессиональные навыки</strong><span>{profile.hardSkills.map(toRuLabel).join(", ")}</span></div>
              <div><strong>Гибкие навыки</strong><span>{profile.softSkills.map(toRuLabel).join(", ")}</span></div>
              <div><strong>DISC</strong><span>{profile.discProfile.join(" / ")}</span></div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
