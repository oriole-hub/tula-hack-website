import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../shared/ui/Button";

const schema = z.object({
  company_name: z.string().min(2),
  industry: z.string().min(2),
  company_size: z.string().min(1),
  region: z.string().min(2),
  admin_name: z.string().min(3),
  admin_email: z.string().email(),
  password: z.string().min(8),
});

type SignupValues = z.infer<typeof schema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupValues>({
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
            <span>ключевых блока: люди, команды, риски, резерв</span>
          </div>
          <div className="auth-fact">
            <strong>100%</strong>
            <span>визуальный контур готов к работе уже сейчас</span>
          </div>
        </div>
      </section>

      <section className="auth-page__panel auth-page__panel--form">
        <div className="auth-form-head">
          <p>Регистрация компании</p>
          <h2>Создать пространство</h2>
          <span className="auth-form-head__note">После регистрации вы сразу попадёте в рабочий кабинет.</span>
        </div>
        <form
          className="auth-form auth-form--grid"
          onSubmit={handleSubmit(() => {
            navigate("/dashboard");
          })}
        >
          <label>
            <span>Компания</span>
            <input {...register("company_name")} placeholder="TEAM BUILDER" />
          </label>
          <label>
            <span>Сфера</span>
            <input {...register("industry")} placeholder="HR Tech" />
          </label>
          <label>
            <span>Размер</span>
            <input {...register("company_size")} placeholder="201-500" />
          </label>
          <label>
            <span>Регион</span>
            <input {...register("region")} placeholder="Москва" />
          </label>
          <label>
            <span>Администратор</span>
            <input {...register("admin_name")} placeholder="Анастасия Белова" />
          </label>
          <label>
            <span>Эл. почта</span>
            <input {...register("admin_email")} placeholder="admin@teambuilder.io" />
          </label>
          <label className="auth-form__wide">
            <span>Пароль</span>
            <input type="password" {...register("password")} placeholder="Минимум 8 символов" />
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
