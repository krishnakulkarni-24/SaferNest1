import { useEffect, useState } from "react";
import { incidentApi, resourceApi, taskApi } from "../api/services";

const AdminPanelPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [taskPayload, setTaskPayload] = useState({ incidentId: "", priority: "HIGH", status: "CREATED" });
  const [resourcePayload, setResourcePayload] = useState({ type: "FOOD", quantity: 1, location: "" });

  const refresh = async () => {
    const response = await incidentApi.list();
    setIncidents(response.data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    await taskApi.create(taskPayload);
    setTaskPayload({ incidentId: "", priority: "HIGH", status: "CREATED" });
  };

  const createResource = async (event) => {
    event.preventDefault();
    await resourceApi.create({ ...resourcePayload, quantity: Number(resourcePayload.quantity) });
    setResourcePayload({ type: "FOOD", quantity: 1, location: "" });
  };

  const updateIncidentStatus = async (incidentId, status) => {
    await incidentApi.updateStatus(incidentId, { status });
    await refresh();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={createResource} className="bg-white dark:bg-slate-800 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Create Resource</h3>
          <select className="w-full p-2 border rounded bg-transparent" value={resourcePayload.type} onChange={(e) => setResourcePayload({ ...resourcePayload, type: e.target.value })}>
            <option value="FOOD">Food</option>
            <option value="MEDICAL">Medical</option>
            <option value="SHELTER">Shelter</option>
            <option value="WATER">Water</option>
            <option value="TRANSPORT">Transport</option>
            <option value="OTHER">Other</option>
          </select>
          <input className="w-full p-2 border rounded bg-transparent" type="number" min={1} value={resourcePayload.quantity} onChange={(e) => setResourcePayload({ ...resourcePayload, quantity: e.target.value })} required />
          <input className="w-full p-2 border rounded bg-transparent" placeholder="Location" value={resourcePayload.location} onChange={(e) => setResourcePayload({ ...resourcePayload, location: e.target.value })} required />
          <button className="px-3 py-2 rounded bg-blue-600 text-white">Create Resource</button>
        </form>

        <form onSubmit={createTask} className="bg-white dark:bg-slate-800 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Create Task</h3>
          <select className="w-full p-2 border rounded bg-transparent" value={taskPayload.incidentId} onChange={(e) => setTaskPayload({ ...taskPayload, incidentId: e.target.value })} required>
            <option value="">Select Incident</option>
            {incidents.map((incident) => (
              <option key={incident.id} value={incident.id}>{incident.title}</option>
            ))}
          </select>
          <select className="w-full p-2 border rounded bg-transparent" value={taskPayload.priority} onChange={(e) => setTaskPayload({ ...taskPayload, priority: e.target.value })}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button className="px-3 py-2 rounded bg-purple-600 text-white">Create Task</button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Manage Incident Status</h3>
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-3 border rounded border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{incident.title}</p>
                <p className="text-sm">Current: {incident.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateIncidentStatus(incident.id, "IN_PROGRESS")} className="px-2 py-1 rounded text-sm bg-amber-600 text-white">In Progress</button>
                <button onClick={() => updateIncidentStatus(incident.id, "RESOLVED")} className="px-2 py-1 rounded text-sm bg-emerald-600 text-white">Resolved</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
