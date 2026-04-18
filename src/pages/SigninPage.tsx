import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../shared/ui/Button";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type SigninValues = z.infer<typeof schema>;

export const SigninPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<SigninValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@teambuilder.io",
      password: "password123",
    },
  });

  return (
    <div className="auth-page">
      <section className="auth-page__panel auth-page__panel--brand">
        <div className="brand-mark">TEAM BUILDER</div>

        <div className="auth-hero">
          <p className="auth-hero__eyebrow">HR-аналитика для реальных управленческих решений</p>
          <h1>Сильные команды на ясных данных</h1>
          <p className="auth-hero__lead">
            Дашборды, профили сотрудников, pulse-сигналы, кадровый резерв и сравнение кандидатов в одном рабочем пространстве.
          </p>
        </div>

        <div className="auth-hero__facts">
          <div className="auth-fact">
            <strong>82</strong>
            <span>индекс здоровья команды</span>
          </div>
          <div className="auth-fact">
            <strong>24%</strong>
            <span>зона риска конфликтов</span>
          </div>
          <div className="auth-fact">
            <strong>12</strong>
            <span>ключевых сценариев уже в системе</span>
          </div>
        </div>
      </section>

      <section className="auth-page__panel auth-page__panel--form">
        <div className="auth-form-head">
          <p>Вход</p>
          <h2>Продолжить работу</h2>
          <span className="auth-form-head__note">Войдите в рабочее пространство TEAM BUILDER.</span>
        </div>
        <form
          className="auth-form"
          onSubmit={handleSubmit(() => {
            navigate("/dashboard");
          })}
        >
          <label>
            <span>Рабочая почта</span>
            <input {...register("email")} />
            {formState.errors.email ? <small>{formState.errors.email.message}</small> : null}
          </label>
          <label>
            <span>Пароль</span>
            <input type="password" {...register("password")} />
            {formState.errors.password ? <small>{formState.errors.password.message}</small> : null}
          </label>
          <Button type="submit">Войти</Button>
        </form>
        <p className="auth-form__caption">
          Нет аккаунта? <Link to="/signup">Создать компанию</Link>
        </p>
      </section>
    </div>
  );
};
