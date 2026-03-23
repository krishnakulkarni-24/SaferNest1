import { useEffect, useState } from "react";
import { incidentApi, resourceApi, taskApi } from "../api/services";
import AiSummaryCard from "../components/AiSummaryCard";
import { useRealtimeUpdates } from "../hooks/useRealtimeUpdates";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ incidents: 0, resources: 0, tasks: 0 });
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const canViewAiSummary = user?.role === "ADMIN" || user?.role === "AUTHORITY";

  useRealtimeUpdates((message) => {
    setNotifications((prev) => [message, ...prev].slice(0, 10));
  });

  useEffect(() => {
    const fetchData = async () => {
      const [incidents, resources, tasks] = await Promise.all([
        incidentApi.list(),
        resourceApi.list(),
        taskApi.list(),
      ]);

      setIncidents(incidents.data || []);
      setStats({
        incidents: incidents.data.length,
        resources: resources.data.length,
        tasks: tasks.data.length,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-500">Role-based command center for {user?.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg"><p className="text-sm text-slate-500">Incidents</p><p className="text-3xl font-bold">{stats.incidents}</p></div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg"><p className="text-sm text-slate-500">Resources</p><p className="text-3xl font-bold">{stats.resources}</p></div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg"><p className="text-sm text-slate-500">Tasks</p><p className="text-3xl font-bold">{stats.tasks}</p></div>
      </div>

      {canViewAiSummary && <AiSummaryCard incidents={incidents} />}

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Live Updates</h3>
        <div className="space-y-2 max-h-72 overflow-auto">
          {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet</p>}
          {notifications.map((item, index) => (
            <div key={`${item.timestamp}-${index}`} className="p-2 bg-slate-100 dark:bg-slate-700 rounded">
              <p className="text-sm font-semibold">{item.type}</p>
              <p className="text-sm">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
