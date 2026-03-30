import { useEffect, useMemo, useState } from "react";
import { taskApi } from "../api/services";
import { hasTaskForIncident } from "../utils/incidentTasks";
import { getTaskForIncident } from "../utils/getTaskForIncident";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Flame, HeartPulse, Waves, PlusCircle, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { incidentApi } from "../api/services";
import AssignTaskModal from "../components/AssignTaskModal";
import { useAuthStore } from "../store/authStore";

const detectIncidentType = (incident) => {
  const source = `${incident?.title || ""} ${incident?.description || ""}`.toLowerCase();
  if (source.includes("earthquake")) {
    return "EARTHQUAKE";
  }
  if (source.includes("fire")) {
    return "FIRE";
  }
  if (source.includes("medical") || source.includes("injury") || source.includes("ambulance")) {
    return "MEDICAL";
  }
  return "FLOOD";
};

const detectPriority = (incident) => {
  const source = `${incident?.title || ""} ${incident?.description || ""}`.toLowerCase();
  if (source.includes("critical") || source.includes("urgent") || source.includes("severe")) {
    return "HIGH";
  }
  if (source.includes("minor") || source.includes("low")) {
    return "LOW";
  }
  return "MEDIUM";
};

const typeBadgeClass = (type) => {
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

const priorityBadgeClass = (priority) => {
  if (priority === "HIGH") {
    return "bg-red-100 text-red-700";
  }
  if (priority === "LOW") {
    return "bg-green-100 text-green-700";
  }
  return "bg-orange-100 text-orange-700";
};

const statusBadgeClass = (status) => {
  if (status === "RESOLVED") {
    return "bg-green-100 text-green-700";
  }
  if (status === "IN_PROGRESS") {
    return "bg-orange-100 text-orange-700";
  }
  return "bg-blue-100 text-blue-700";
};

const typeIcon = (type) => {
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


const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (user.role === "ADMIN" || user.role === "AUTHORITY");

  const refreshIncidents = async () => {
    const response = await incidentApi.list();
    setIncidents(response.data);
    const tasksRes = await taskApi.list();
    setTasks(tasksRes.data);
  };

  useEffect(() => {
    refreshIncidents();
  }, []);

  const handleStatusUpdate = async (incidentId, status) => {
    await incidentApi.updateStatus(incidentId, { status });
    await refreshIncidents();
  };

  const handleAssignTask = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setAssignModalOpen(true);
  };

  const mapCenter = useMemo(() => {
    if (incidents.length > 0) {
      return [incidents[0].locationLat, incidents[0].locationLng];
    }
    return [20.5937, 78.9629];
  }, [incidents]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827] dark:text-slate-100">Incidents Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track all reported incidents across map and list views.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="sn-card h-[560px] p-4">
          <MapContainer center={mapCenter} zoom={5} className="h-full w-full rounded-2xl">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {incidents.map((incident) => (
              <Marker key={incident.id} position={[incident.locationLat, incident.locationLng]}>
                <Popup>
                  <strong>{incident.title}</strong>
                  <br />
                  {incident.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="sn-card h-[560px] overflow-auto dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-100">Incident List</h3>
            <span className="sn-badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{incidents.length} incidents</span>
          </div>

          <div className="space-y-3">
            {incidents.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No incidents found.</p>}

            {incidents.map((incident) => {
              const incidentType = detectIncidentType(incident);
              const priority = detectPriority(incident);
              const TypeIcon = typeIcon(incidentType);

              return (
                <div
                  key={incident.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111827] dark:text-slate-100">{incident.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{incident.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`sn-badge ${typeBadgeClass(incidentType)}`}>
                        <TypeIcon size={12} className="mr-1" />
                        {incidentType}
                      </span>
                      <span className={`sn-badge ${priorityBadgeClass(priority)}`}>{priority}</span>
                      <span className={`sn-badge ${statusBadgeClass(incident.status)}`}>{incident.status}</span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400 md:grid-cols-2">
                    <p>Latitude: {incident.locationLat}</p>
                    <p>Longitude: {incident.locationLng}</p>
                  </div>
                  {isAdmin && (() => {
                    // Hide all admin options if incident is resolved
                    if (incident.status === "RESOLVED") return null;
                    const task = getTaskForIncident(incident, tasks);
                    // If task exists and is COMPLETED, hide all options
                    if (task && task.status === "COMPLETED") return null;
                    return (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {!task && (
                          <button
                            className="sn-btn-primary flex items-center gap-1 px-3 py-2 text-sm"
                            onClick={() => handleAssignTask(incident.id)}
                          >
                            <PlusCircle size={16} /> Assign Task
                          </button>
                        )}
                        <button
                          className="sn-btn-neutral flex items-center gap-1 px-3 py-2 text-sm"
                          onClick={() => handleStatusUpdate(incident.id, "IN_PROGRESS")}
                          disabled={incident.status === "IN_PROGRESS"}
                        >
                          <RefreshCw size={16} /> In Progress
                        </button>
                        <button
                          className="sn-btn-success flex items-center gap-1 px-3 py-2 text-sm"
                          onClick={() => handleStatusUpdate(incident.id, "RESOLVED")}
                          disabled={incident.status === "RESOLVED"}
                        >
                          <CheckCircle2 size={16} /> Mark Completed
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Modal rendered outside grid for proper overlay */}
      <AssignTaskModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        incidentId={selectedIncidentId}
        onTaskCreated={refreshIncidents}
      />
    </div>
  );
};

export default IncidentsPage;
