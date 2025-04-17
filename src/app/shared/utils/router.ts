export const API_ENDPOINTS = {
  user: {
    signIn: (email: string) => `user?email=${encodeURIComponent(email)}`,
    signUp: `user`,
  },
  task: {
    get: (userId: string, filter: string, order: string) =>
      `task/${encodeURIComponent(userId)}?filter=${encodeURIComponent(
        filter
      )}&order=${encodeURIComponent(order)}`,
    create: (userId: string) => `task/${encodeURIComponent(userId)}`,
    update: (userId: string, id: string) =>
      `task/${encodeURIComponent(userId)}/${encodeURIComponent(id)}`,
    delete: (userId: string, id: string) =>
      `task/${encodeURIComponent(userId)}/${encodeURIComponent(id)}`,
    toggle: (userId: string, id: string) =>
      `task/${encodeURIComponent(userId)}/${encodeURIComponent(id)}`,
  },
};

export const EXCLUDED_PATHS = ['/user'];
