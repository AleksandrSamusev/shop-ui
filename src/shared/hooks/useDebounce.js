import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until after `delay` ms
 * Useful for search inputs, API calls, etc.
 */
export function useDebounce(value, delay = 700) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup → cancels previous timer if value changes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}