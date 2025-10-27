// TODO: useProgress hook placeholder
import { useState, useEffect } from 'react';

export default function useProgress(goalId) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // placeholder: load progress for goalId
    setProgress(0);
  }, [goalId]);

  return { progress, setProgress };
}
