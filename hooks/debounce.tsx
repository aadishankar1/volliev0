import { useState, useEffect } from "react";
export default function useDebounce(value: any, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); 
    };
  }, [value, delay]);

  return debouncedValue;
}
