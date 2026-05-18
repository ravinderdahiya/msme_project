import http from "../api/axios"

// POST - Create user
export const createUser = async (userData) => {
  return http.post('/api/users', userData);
};

// GET - Fetch users
export const getUsers = async () => {
  return http.get('/api/users');
};

// GET - Fetch single user
export const getUserById = async (id) => {
  return http.get(`/api/users/${id}`);
};
