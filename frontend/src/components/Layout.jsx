import { useState } from "react";
import { Menu, Bell, LogOut, Moon, SunMedium, Shield, LayoutDashboard, Siren, ClipboardList, HandHelping, UserCog } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

const Layout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const darkMode = useUiStore((state) => state.darkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "AUTHORITY", "VOLUNTEER", "CITIZEN"],
    },
    {
      path: "/report-incident",
      label: "Report Incident",
      icon: Siren,
      roles: ["CITIZEN", "AUTHORITY", "ADMIN"],
    },
    {
      path: "/incidents",
      label: "Incidents",
      icon: ClipboardList,
      roles: ["ADMIN", "AUTHORITY", "VOLUNTEER", "CITIZEN"],
    },
    {
      path: "/requests",
      label: "Resource Requests",
      icon: HandHelping,
      roles: ["CITIZEN", "VOLUNTEER", "AUTHORITY", "ADMIN"],
    },
    {
      path: "/volunteer-tasks",
      label: "Volunteer Panel",
      icon: Shield,
      roles: ["VOLUNTEER", "ADMIN", "AUTHORITY"],
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: UserCog,
      roles: ["ADMIN"],
    },
  ];

  const allowedLinks = links.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#1E40AF] text-white shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-blue-700/70 px-6 py-6">
            <h1 className="text-2xl font-extrabold tracking-tight">SaferNest</h1>
            <p className="mt-1 text-sm text-blue-100">Disaster command dashboard</p>
          </div>

          <div className="px-4 py-4">
            <div className="rounded-2xl bg-blue-800/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-blue-200">Signed in as</p>
              <p className="mt-2 font-semibold">{user?.name}</p>
              <p className="text-sm text-blue-100">{user?.role}</p>
            </div>

            <nav className="mt-6 space-y-2">
              {allowedLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white text-[#1E40AF] shadow-md"
                          : "text-blue-100 hover:bg-blue-700/70 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-blue-700/70 px-4 py-4">
            <button onClick={handleLogout} className="sn-btn-danger w-full">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="sn-btn-neutral px-3 py-2 lg:hidden"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Operations Center</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Monitor incidents and response in real-time</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="sn-btn-neutral px-3 py-2" aria-label="Notifications">
                  <Bell size={16} />
                </button>
                <button type="button" onClick={toggleDarkMode} className="sn-btn-neutral px-3 py-2">
                  {darkMode ? <SunMedium size={16} /> : <Moon size={16} />}
                  <span className="hidden md:inline">{darkMode ? "Light" : "Dark"}</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
};

export default Layout;
