import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// POST - Create user
export const createUser = async (userData) => {
  return api.post('/users', userData);
};

// GET - Fetch users
export const getUsers = async () => {
  return api.get('/users');
};

// GET - Fetch single user
export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};