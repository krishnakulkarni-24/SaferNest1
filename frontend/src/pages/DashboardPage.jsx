import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Sparkles, Waves, Flame, HeartPulse } from "lucide-react";
import { incidentApi, resourceApi, taskApi } from "../api/services";
import AiSummaryCard from "../components/AiSummaryCard";
import { useRealtimeUpdates } from "../hooks/useRealtimeUpdates";
import { useAuthStore } from "../store/authStore";

const getIncidentType = (incident) => {
  const source = `${incident?.title || ""} ${incident?.description || ""}`.toLowerCase();
  if (source.includes("earthquake")) {
    return "EARTHQUAKE";
  }
  if (source.includes("fire")) {
    return "FIRE";
  }
  if (source.includes("medical") || source.includes("injury") || source.includes("hospital") || source.includes("ambulance")) {
    return "MEDICAL";
  }
  return "FLOOD";
};

const getTypeBadgeClass = (type) => {
  if (type === "EARTHQUAKE") {
    return "bg-yellow-100 text-yellow-700";
  }
  if (type === "FIRE") {
    return "bg-red-100 text-red-700";
  }
  if (type === "MEDICAL") {
    return "bg-green-100 text-green-700";
  }
  return "bg-blue-100 text-blue-700";
};

const getTypeIcon = (type) => {
  if (type === "EARTHQUAKE") {
    return AlertTriangle;
  }
  if (type === "FIRE") {
    return Flame;
  }
  if (type === "MEDICAL") {
    return HeartPulse;
  }
  return Waves;
};

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
      <div className="sn-card bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white">
        <p className="text-xs uppercase tracking-[0.16em] text-blue-100">Mission Control</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Disaster Response Dashboard</h2>
        <p className="mt-2 text-sm text-blue-100">Real-time command center for {user?.role?.toLowerCase()} operations and field coordination.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="sn-card hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Incidents</p>
            <AlertTriangle className="text-[#F97316]" size={18} />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{stats.incidents}</p>
        </div>

        <div className="sn-card hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Cases</p>
            <Activity className="text-[#2563EB]" size={18} />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {incidents.filter((incident) => incident.status !== "RESOLVED").length}
          </p>
        </div>

        <div className="sn-card hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved</p>
            <CheckCircle2 className="text-[#22C55E]" size={18} />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {incidents.filter((incident) => incident.status === "RESOLVED").length}
          </p>
        </div>

        <div className="sn-card hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Open Tasks</p>
            <Activity className="text-[#1E40AF]" size={18} />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{stats.tasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="sn-card dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">Recent Incidents</h3>
              <span className="sn-badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{incidents.length} records</span>
            </div>

            <div className="space-y-3">
              {incidents.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No incidents reported yet.</p>}

              {incidents.slice(0, 6).map((incident) => {
                const incidentType = getIncidentType(incident);
                const TypeIcon = getTypeIcon(incidentType);

                return (
                  <div
                    key={incident.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/70"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{incident.title}</h4>
                      <span className={`sn-badge ${getTypeBadgeClass(incidentType)}`}>
                        <TypeIcon size={12} className="mr-1" />
                        {incidentType}
                      </span>
                      <span className="sn-badge bg-[#F97316]/10 text-[#C2410C]">MEDIUM</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{incident.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sn-card dark:bg-slate-900">
            <h3 className="mb-3 text-lg font-semibold text-[#111827] dark:text-slate-100">Live Updates</h3>
            <div className="max-h-72 space-y-3 overflow-auto pr-1">
              {notifications.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>}
              {notifications.map((item, index) => (
                <div
                  key={`${item.timestamp}-${index}`}
                  className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 transition-all duration-200 hover:shadow-md dark:border-blue-900/60 dark:bg-slate-800"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">{item.type}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {canViewAiSummary && (
            <div className="sn-card border border-[#F97316]/30 bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 dark:to-slate-900 dark:border-orange-800/40">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-[#F97316]" />
                <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">AI Incident Insight</h3>
              </div>
              <AiSummaryCard incidents={incidents} />
            </div>
          )}

          <div className="sn-card dark:bg-slate-900">
            <h3 className="mb-2 text-lg font-semibold text-[#111827] dark:text-slate-100">Resource Snapshot</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quick operational counters for active deployment planning.</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-300">Resources</span>
                <span className="text-sm font-bold text-[#1E40AF]">{stats.resources}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-300">Task Queue</span>
                <span className="text-sm font-bold text-[#1E40AF]">{stats.tasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
