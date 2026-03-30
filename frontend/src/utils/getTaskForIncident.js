// Utility to get the task for an incident
export function getTaskForIncident(incident, tasks) {
  if (!tasks || !Array.isArray(tasks)) return null;
  return tasks.find((task) => task.incidentId === incident.id) || null;
}
