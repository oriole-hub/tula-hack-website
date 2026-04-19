import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../shared/ui/Button";
import { useSession } from "../shared/state/session";

const schema = z.object({
  company_name: z.string().min(2, "Введите название компании"),
  industry: z.string().min(2, "Введите сферу"),
  company_size: z.string().min(1, "Укажите размер компании"),
  region: z.string().min(2, "Укажите регион"),
  admin_name: z.string().min(3, "Введите имя администратора"),
  admin_email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type SignupValues = z.infer<typeof schema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const { registerCompany } = useSession();
  const { register, handleSubmit, formState } = useForm<SignupValues>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="auth-page">
      <section className="auth-page__panel auth-page__panel--brand">
        <div className="brand-mark">TEAM BUILDER</div>

        <div className="auth-hero">
          <p className="auth-hero__eyebrow">Запуск без долгого внедрения</p>
          <h1>Соберите рабочее пространство за несколько минут</h1>
          <p className="auth-hero__lead">
            Зарегистрируйте компанию, задайте структуру и сразу переходите к аналитике по людям, ролям и командам.
          </p>
        </div>

        <div className="auth-hero__facts">
          <div className="auth-fact">
            <strong>1</strong>
            <span>единое пространство для HR и руководителей</span>
          </div>
          <div className="auth-fact">
            <strong>4</strong>
            <span>главных блока: люди, команды, риски и резерв</span>
          </div>
          <div className="auth-fact">
            <strong>100%</strong>
            <span>готовый визуальный контур для начала работы</span>
          </div>
        </div>
      </section>

      <section className="auth-page__panel auth-page__panel--form">
        <div className="auth-form-head">
          <p>Регистрация компании</p>
          <h2>Создать пространство</h2>
          <span className="auth-form-head__note">После регистрации вы заходите в систему как администратор компании.</span>
        </div>
        <form
          className="auth-form auth-form--grid"
          onSubmit={handleSubmit((values) => {
            registerCompany({
              adminName: values.admin_name,
              companyName: values.company_name,
              region: values.region,
            });
            navigate("/dashboard");
          })}
        >
          <label>
            <span>Компания</span>
            <input {...register("company_name")} placeholder="TEAM BUILDER" />
            {formState.errors.company_name ? <small>{formState.errors.company_name.message}</small> : null}
          </label>
          <label>
            <span>Сфера</span>
            <input {...register("industry")} placeholder="HR Tech" />
            {formState.errors.industry ? <small>{formState.errors.industry.message}</small> : null}
          </label>
          <label>
            <span>Размер</span>
            <input {...register("company_size")} placeholder="201-500" />
            {formState.errors.company_size ? <small>{formState.errors.company_size.message}</small> : null}
          </label>
          <label>
            <span>Регион</span>
            <input {...register("region")} placeholder="Москва" />
            {formState.errors.region ? <small>{formState.errors.region.message}</small> : null}
          </label>
          <label>
            <span>Администратор</span>
            <input {...register("admin_name")} placeholder="Анастасия Белова" />
            {formState.errors.admin_name ? <small>{formState.errors.admin_name.message}</small> : null}
          </label>
          <label>
            <span>Эл. почта</span>
            <input {...register("admin_email")} placeholder="admin@teambuilder.io" />
            {formState.errors.admin_email ? <small>{formState.errors.admin_email.message}</small> : null}
          </label>
          <label className="auth-form__wide">
            <span>Пароль</span>
            <input type="password" {...register("password")} placeholder="Минимум 8 символов" />
            {formState.errors.password ? <small>{formState.errors.password.message}</small> : null}
          </label>
          <Button type="submit">Создать компанию</Button>
        </form>
        <p className="auth-form__caption">
          Уже есть доступ? <Link to="/signin">Войти в систему</Link>
        </p>
      </section>
    </div>
  );
};
