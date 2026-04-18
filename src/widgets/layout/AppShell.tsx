import { Link, Outlet, useLocation } from "react-router-dom";
import { navigationItems } from "../../features/navigation/menu";
import { roleLabels, roleOrder } from "../../entities/session/model";
import { useSession } from "../../shared/state/session";
import { Card } from "../../shared/ui/Card";
import { Button } from "../../shared/ui/Button";

export const AppShell = () => {
  const { pathname } = useLocation();
  const { role, setRole } = useSession();

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="brand-mark">TEAM BUILDER</div>

        <div className="app-shell__brand">
          <img src="/brand/t2-logo-white.svg" alt="TEAM BUILDER" />
        </div>

        <nav className="app-shell__nav">
          {navigationItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <Link
                key={item.path}
                className={pathname === item.path ? "nav-link nav-link--active" : "nav-link"}
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <Card className="role-switcher">
          <p className="role-switcher__label">Роль просмотра</p>
          <div className="role-switcher__grid">
            {roleOrder.map((item) => (
              <button
                key={item}
                className={item === role ? "role-pill role-pill--active" : "role-pill"}
                onClick={() => setRole(item)}
                type="button"
              >
                {roleLabels[item]}
              </button>
            ))}
          </div>
        </Card>

        <Button className="app-shell__logout" variant="ghost">
          Рабочее пространство
        </Button>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
};
