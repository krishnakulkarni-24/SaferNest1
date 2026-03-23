import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

const Layout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const darkMode = useUiStore((state) => state.darkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const links = [
    { path: "/dashboard", label: "Dashboard", roles: ["ADMIN", "AUTHORITY", "VOLUNTEER", "CITIZEN"] },
    { path: "/report-incident", label: "Report Incident", roles: ["CITIZEN", "AUTHORITY", "ADMIN"] },
    { path: "/incidents", label: "Incidents", roles: ["ADMIN", "AUTHORITY", "VOLUNTEER", "CITIZEN"] },
    { path: "/requests", label: "Resource Requests", roles: ["CITIZEN", "VOLUNTEER", "AUTHORITY", "ADMIN"] },
    { path: "/volunteer-tasks", label: "Volunteer Panel", roles: ["VOLUNTEER", "ADMIN", "AUTHORITY"] },
    { path: "/admin", label: "Admin Panel", roles: ["ADMIN"] },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-bold">SaferNest</h1>
            <p className="text-sm text-slate-500">{user?.name} ({user?.role})</p>
          </div>
          <nav className="flex flex-wrap gap-3">
            {links
              .filter((item) => item.roles.includes(user?.role))
              .map((item) => (
                <Link key={item.path} to={item.path} className="text-sm px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">
                  {item.label}
                </Link>
              ))}
          </nav>
          <div className="flex gap-2">
            <button onClick={toggleDarkMode} className="px-3 py-1 text-sm rounded bg-slate-200 dark:bg-slate-700">
              {darkMode ? "Light" : "Dark"}
            </button>
            <button onClick={handleLogout} className="px-3 py-1 text-sm rounded bg-red-500 text-white">Logout</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
