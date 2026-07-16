import { useCallback, useState } from 'react';

// Theoretical Explanation §6 (Loading & Error Handling UI) names three explicit
// UI states an async operation must expose: Loading, Error, Success.
// This hook centralizes that pattern so any async action (saving a draft,
// running the content-policy check, etc.) reports it consistently.
export function useAsyncStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const run = useCallback(async (task) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await task();
      setSuccess(typeof result === 'string' ? result : 'Done');
      return { ok: true, result };
    } catch (err) {
      setError(err?.message || String(err));
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  return { loading, error, success, run, clear };
}
