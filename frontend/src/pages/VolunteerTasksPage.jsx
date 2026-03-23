import { useEffect, useState } from "react";
import { taskApi } from "../api/services";
import { useAuthStore } from "../store/authStore";

const VolunteerTasksPage = () => {
  const user = useAuthStore((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setError("");
    try {
      const response = await taskApi.list();
      setTasks(response.data);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to load tasks.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const acceptTask = async (taskId) => {
    try {
      await taskApi.assign(taskId, { volunteerId: user.id });
      await fetchTasks();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to accept task.");
    }
  };

  const completeTask = async (taskId) => {
    try {
      await taskApi.complete(taskId);
      await fetchTasks();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to complete task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskApi.remove(taskId);
      await fetchTasks();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to delete task.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-4">Volunteer Task Panel</h2>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 border rounded border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{task.incidentTitle}</p>
              <p className="text-sm">Priority: {task.priority}</p>
              <p className="text-sm">Status: {task.status}</p>
              {task.assignedToName && <p className="text-sm text-slate-500">Assigned: {task.assignedToName}</p>}
            </div>
            <div className="flex gap-2">
              {!task.assignedToId && (
                <button onClick={() => acceptTask(task.id)} className="px-3 py-2 rounded bg-green-600 text-white text-sm">Accept Task</button>
              )}

              {task.assignedToId === user?.id && task.status !== "COMPLETED" && (
                <button onClick={() => completeTask(task.id)} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Mark Complete</button>
              )}

              {["ADMIN", "AUTHORITY"].includes(user?.role) && (
                <button onClick={() => deleteTask(task.id)} className="px-3 py-2 rounded bg-red-600 text-white text-sm">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerTasksPage;
