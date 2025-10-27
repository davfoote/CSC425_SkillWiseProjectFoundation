// TODO: auth API service
import api from './api';

export async function login(credentials) {
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function refresh() {
  const res = await api.post('/auth/refresh');
  return res.data;
}

export default { login, refresh };
