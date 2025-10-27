// TODO: useApi hook placeholder
import { useState, useCallback } from 'react';
import api from '../services/api';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const call = useCallback(async (fn) => {
    setLoading(true);
    try {
      const res = await fn(api);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, call };
}
