// Utility to check if an incident has a task assigned
export function hasTaskForIncident(incident, tasks) {
  if (!tasks || !Array.isArray(tasks)) return false;
  return tasks.some((task) => task.incidentId === incident.id);
}
