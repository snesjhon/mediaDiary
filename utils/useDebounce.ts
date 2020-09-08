/**
 * DEBOUNCE
 * ---
 * Add debounce into app
 *
 * Resource:
 * - https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
 */
import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
