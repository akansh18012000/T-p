// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState, useEffect, useRef } from "react";

export interface UseDebouncedSearchOptions {
  /** Minimum characters required before searching (default: 3) */
  minLength?: number;
  /** Debounce delay in milliseconds (default: 1000) */
  delay?: number;
}

export interface UseDebouncedSearchResult {
  /** The debounced value (only set after delay and minLength met) */
  debouncedValue: string;
  /** Whether we're currently in the debounce waiting period */
  isDebouncing: boolean;
  /** Whether the input meets minimum length requirement */
  meetsMinLength: boolean;
}

/**
 * Hook for debounced search with minimum character requirement.
 * Returns debounced value only after delay and when minLength is met.
 *
 * @param value - The input value to debounce
 * @param options - Configuration options
 * @returns Debounced search state
 */
export function useDebouncedSearch(
  value: string,
  options: UseDebouncedSearchOptions = {}
): UseDebouncedSearchResult {
  const { minLength = 3, delay = 1000 } = options;

  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meetsMinLength = value.length >= minLength;

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // If minimum length not met, clear debounced value and stop
    if (!meetsMinLength) {
      setDebouncedValue("");
      setIsDebouncing(false);
      return;
    }

    // Start debouncing
    setIsDebouncing(true);

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, meetsMinLength]);

  return {
    debouncedValue,
    isDebouncing,
    meetsMinLength,
  };
}
// AI Generated Code by Deloitte + Cursor (END)
