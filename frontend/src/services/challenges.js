// TODO: challenges API service
import api from './api';

export async function fetchChallenges() {
  const res = await api.get('/challenges');
  return res.data;
}

export default { fetchChallenges };
