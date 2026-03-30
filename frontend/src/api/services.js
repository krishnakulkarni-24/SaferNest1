import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const incidentApi = {
  create: (payload) => api.post("/incidents", payload),
  list: () => api.get("/incidents"),
  updateStatus: (id, payload) => api.put(`/incidents/${id}/status`, payload),
  delete: (id) => api.delete(`/incidents/${id}`),
};

export const aiApi = {
  summarize: (payload) => api.post("/ai/summarize", payload),
};

export const resourceApi = {
  create: (payload) => api.post("/resources", payload),
  list: () => api.get("/resources"),
};

export const taskApi = {
  create: (payload) => api.post("/tasks", payload),
  list: () => api.get("/tasks"),
  assign: (id, payload) => api.put(`/tasks/${id}/assign`, payload),
  complete: (id) => api.put(`/tasks/${id}/complete`),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export const requestApi = {
  create: (payload) => api.post("/requests", payload),
  list: () => api.get("/requests"),
};
