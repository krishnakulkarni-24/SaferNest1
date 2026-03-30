import { useState } from "react";
import Modal from "./Modal";
import { taskApi } from "../api/services";

const AssignTaskModal = ({ open, onClose, incidentId, onTaskCreated }) => {
  const [priority, setPriority] = useState("HIGH");
  const [status, setStatus] = useState("CREATED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await taskApi.create({ incidentId, priority, status });
      setLoading(false);
      onTaskCreated?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task.");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">Assign Task to Incident</h3>
      <form onSubmit={handleSubmit} className="space-y-3 w-full">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="sn-input w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        {/* Only show status select for non-admins (accept/complete task) - Admins cannot accept */}
        {/* Remove status select for admin (assign only) */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="sn-btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      </form>
    </Modal>
  );
};

export default AssignTaskModal;
