import axios from "axios";

const API = "http://localhost:3000";

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);