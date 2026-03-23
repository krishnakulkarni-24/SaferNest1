import { useEffect, useState } from "react";
import { requestApi, resourceApi } from "../api/services";
import { useAuthStore } from "../store/authStore";

const ResourceRequestsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resourcePayload, setResourcePayload] = useState({ type: "FOOD", quantity: 1, location: "" });

  const loadResources = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await resourceApi.list();
      setResources(response.data || []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not load resources.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedResourceId) {
      return;
    }

    try {
      await requestApi.create({ resourceId: selectedResourceId });
      setMessage("Resource request submitted.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to submit request.");
    }
  };

  const createResource = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await resourceApi.create({
        ...resourcePayload,
        quantity: Number(resourcePayload.quantity),
      });
      setMessage("Resource added successfully.");
      setResourcePayload({ type: "FOOD", quantity: 1, location: "" });
      await loadResources();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to add resource.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Available Resources</h2>
          <button onClick={loadResources} className="px-3 py-1 text-sm rounded bg-slate-200 dark:bg-slate-700" type="button">
            Refresh
          </button>
        </div>
        {loading && <p className="text-sm text-slate-500">Loading resources...</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {!loading && !error && resources.length === 0 && (
          <p className="text-sm text-slate-500">No resources available yet. Ask Admin/Authority to add resources or enable seed data.</p>
        )}
        <div className="space-y-2">
          {resources.map((resource) => (
            <div key={resource.id} className="p-3 border rounded border-slate-200 dark:border-slate-700">
              <p className="font-semibold">{resource.type}</p>
              <p className="text-sm">Qty: {resource.quantity}</p>
              <p className="text-sm text-slate-500">{resource.location}</p>
              <p className="text-xs text-slate-500 mt-1">Status: {resource.status}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">Request Help</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <select className="w-full p-2 border rounded bg-transparent" value={selectedResourceId} onChange={(e) => setSelectedResourceId(e.target.value)} required disabled={resources.length === 0}>
            <option value="">Select resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.type} ({resource.location})</option>
            ))}
          </select>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" disabled={resources.length === 0}>Submit Request</button>
        </form>
        {message && <p className="mt-3 text-green-600">{message}</p>}

        {["ADMIN", "AUTHORITY"].includes(user?.role) && (
          <form onSubmit={createResource} className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
            <h3 className="font-semibold">Add Resource (Admin / Authority)</h3>
            <select
              className="w-full p-2 border rounded bg-transparent"
              value={resourcePayload.type}
              onChange={(e) => setResourcePayload({ ...resourcePayload, type: e.target.value })}
            >
              <option value="FOOD">Food</option>
              <option value="MEDICAL">Medical</option>
              <option value="SHELTER">Shelter</option>
              <option value="WATER">Water</option>
              <option value="TRANSPORT">Transport</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="number"
              min={1}
              className="w-full p-2 border rounded bg-transparent"
              placeholder="Quantity"
              value={resourcePayload.quantity}
              onChange={(e) => setResourcePayload({ ...resourcePayload, quantity: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded bg-transparent"
              placeholder="Location"
              value={resourcePayload.location}
              onChange={(e) => setResourcePayload({ ...resourcePayload, location: e.target.value })}
              required
            />
            <button className="px-4 py-2 rounded bg-indigo-600 text-white">Add Resource</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResourceRequestsPage;
