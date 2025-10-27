// TODO: goals API service
import api from './api';

export async function fetchGoals() {
  const res = await api.get('/goals');
  return res.data;
}

export default { fetchGoals };
