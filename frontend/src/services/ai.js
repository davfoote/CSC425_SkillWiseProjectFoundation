// TODO: ai API service
import api from './api';

export async function generateChallenges(payload) {
  const res = await api.post('/ai/generate-challenges', payload);
  return res.data;
}

export default { generateChallenges };
