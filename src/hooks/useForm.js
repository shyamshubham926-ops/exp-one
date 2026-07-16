import { useState, useCallback } from 'react';

// Encapsulates controlled-input state + change handling so components
// don't repeat the same useState/onChange boilerplate.
export function useForm(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, handleChange, reset };
}
