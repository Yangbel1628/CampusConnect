import api from "./axios";

// ─── AUTH ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)           => api.post("/auth/register", data),
  login: (data)              => api.post("/auth/login", data),
  getMe: ()                  => api.get("/auth/me"),
  changePassword: (data)     => api.put("/auth/change-password", data),
};

// ─── USERS ───────────────────────────────────────────────────────
export const userAPI = {
  getProfile: (id)           => api.get(`/users/${id}`),
  updateProfile: (data)      => api.put("/users/profile", data),
  updateAvatar: (formData)   => api.put("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  searchUsers: (q)           => api.get(`/users/search?q=${q}`),
  getSuggestions: ()         => api.get("/users/suggestions"),
  sendFriendRequest: (id)    => api.post(`/users/${id}/friend-request`),
  respondFriendRequest: (id, action) => api.put(`/users/${id}/friend-request`, { action }),
};

// ─── POSTS ───────────────────────────────────────────────────────
export const postAPI = {
  getFeed: (page = 1)        => api.get(`/posts/feed?page=${page}`),
  createPost: (formData)     => api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getPost: (id)              => api.get(`/posts/${id}`),
  deletePost: (id)           => api.delete(`/posts/${id}`),
  toggleLike: (id)           => api.put(`/posts/${id}/like`),
  addComment: (id, text)     => api.post(`/posts/${id}/comments`, { text }),
  deleteComment: (id, cId)   => api.delete(`/posts/${id}/comments/${cId}`),
  toggleSave: (id)           => api.put(`/posts/${id}/save`),
  votePoll: (id, optionIndex) => api.post(`/posts/${id}/poll-vote`, { optionIndex }),
};

// ─── EVENTS ──────────────────────────────────────────────────────
export const eventAPI = {
  getAll: (params)           => api.get("/events", { params }),
  getOne: (id)               => api.get(`/events/${id}`),
  create: (data)             => api.post("/events", data),
  update: (id, data)         => api.put(`/events/${id}`, data),
  delete: (id)               => api.delete(`/events/${id}`),
  rsvp: (id, type)           => api.put(`/events/${id}/rsvp`, { type }),
  getMyEvents: ()            => api.get("/events/my-events"),
};

// ─── NOTICES ─────────────────────────────────────────────────────
export const noticeAPI = {
  getAll: (params)           => api.get("/notices", { params }),
  getOne: (id)               => api.get(`/notices/${id}`),
  create: (formData)         => api.post("/notices", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id)               => api.delete(`/notices/${id}`),
  addComment: (id, text)     => api.post(`/notices/${id}/comments`, { text }),
};

// ─── JOBS ────────────────────────────────────────────────────────
export const jobAPI = {
  getAll: (params)           => api.get("/jobs", { params }),
  getOne: (id)               => api.get(`/jobs/${id}`),
  create: (data)             => api.post("/jobs", data),
  apply: (id, data)          => api.post(`/jobs/${id}/apply`, data),
  toggleSave: (id)           => api.put(`/jobs/${id}/save`),
  getMyApplications: ()      => api.get("/jobs/my-applications"),
  updateStatus: (appId, data) => api.put(`/jobs/applications/${appId}/status`, data),
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────
export const notifAPI = {
  getAll: ()                 => api.get("/notifications"),
  getUnreadCount: ()         => api.get("/notifications/unread-count"),
  markRead: (id)             => api.put(`/notifications/${id}/read`),
  markAllRead: ()            => api.put("/notifications/mark-all-read"),
  delete: (id)               => api.delete(`/notifications/${id}`),
};

// ─── MESSAGES ────────────────────────────────────────────────────
export const messageAPI = {
  getConversations: ()       => api.get("/messages/conversations"),
  getMessages: (convId, page = 1) => api.get(`/messages/${convId}?page=${page}`),
  sendMessage: (data)        => api.post("/messages", data),
  markRead: (convId)         => api.put(`/messages/${convId}/read`),
};

// ─── STORIES ─────────────────────────────────────────────────────
export const storyAPI = {
  getStories:  ()            => api.get("/stories"),
  createStory: (formData)    => api.post("/stories", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  viewStory:   (id)          => api.put(`/stories/${id}/view`),
  deleteStory: (id)          => api.delete(`/stories/${id}`),
};