import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../shared/ui/Button";
import { demoAccounts, useSession } from "../shared/state/session";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
  role: z.enum(["company_admin", "hr", "manager"]),
});

type SigninValues = z.infer<typeof schema>;
type SigninRole = SigninValues["role"];

const roleOptions: Array<{ label: string; value: SigninRole }> = [
  { label: "Администратор", value: "company_admin" },
  { label: "HR", value: "hr" },
  { label: "Руководитель", value: "manager" },
];

export const SigninPage = () => {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [authError, setAuthError] = useState("");
  const { register, handleSubmit, formState } = useForm<SigninValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: demoAccounts[0].email,
      password: demoAccounts[0].password,
      role: demoAccounts[0].role as SigninRole,
    },
  });

  return (
    <div className="auth-page">
      <section className="auth-page__panel auth-page__panel--brand">
        <div className="brand-mark">TEAM BUILDER</div>

        <div className="auth-hero">
          <p className="auth-hero__eyebrow">HR-аналитика для управленческих решений</p>
          <h1>Сильные команды на ясных данных</h1>
          <p className="auth-hero__lead">
            Дашборды, профили сотрудников, pulse-сигналы, кадровый резерв и сравнение кандидатов в одном рабочем пространстве.
          </p>
        </div>

        <div className="auth-hero__facts">
          <div className="auth-fact">
            <strong>1</strong>
            <span>единое пространство для HR, руководителей и администраторов</span>
          </div>
          <div className="auth-fact">
            <strong>360°</strong>
            <span>обзор команды: сотрудники, риски, резерв и рекомендации в одном интерфейсе</span>
          </div>
          <div className="auth-fact">
            <strong>3</strong>
            <span>демо-аккаунта с разными правами доступа для проверки ролей</span>
          </div>
        </div>
      </section>

      <section className="auth-page__panel auth-page__panel--form">
        <div className="auth-form-head">
          <p>Вход</p>
          <h2>Продолжить работу</h2>
          <span className="auth-form-head__note">Выберите роль аккаунта и войдите только с соответствующей почтой и паролем.</span>
        </div>
        <form
          className="auth-form"
          onSubmit={handleSubmit((values) => {
            setAuthError("");
            const result = signIn({
              email: values.email,
              password: values.password,
              role: values.role,
            });

            if (!result.ok) {
              setAuthError(result.error ?? "Не удалось выполнить вход.");
              return;
            }

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
          <label>
            <span>Роль</span>
            <select {...register("role")}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {authError ? <div className="form-errors">{authError}</div> : null}

          <Button type="submit">Войти</Button>
        </form>
        <p className="auth-form__caption">
          Нет аккаунта? <Link to="/signup">Создать компанию</Link>
        </p>
      </section>
    </div>
  );
};
