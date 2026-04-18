import { ReactNode } from "react";

export const PageHeader = ({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) => (
  <header className="page-header">
    <div className="page-header__copy">
      <p className="page-header__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-header__description">{description}</p>
    </div>
    {actions ? <div className="page-header__actions">{actions}</div> : null}
  </header>
);
