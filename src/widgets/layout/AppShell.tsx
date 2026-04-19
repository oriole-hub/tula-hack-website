import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../../features/navigation/menu";
import { useSession } from "../../shared/state/session";
import { Button } from "../../shared/ui/Button";

export const AppShell = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { companyName, role, signOut, userName } = useSession();

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="brand-mark">{companyName}</div>

        <div className="app-shell__brand">
          <img src="/brand/t2-logo-white.svg" alt="TEAM BUILDER" />
          <p>{userName}</p>
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

        <Button
          className="app-shell__logout"
          variant="ghost"
          onClick={() => {
            signOut();
            navigate("/signin");
          }}
          type="button"
        >
          Выйти из кабинета
        </Button>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
};
