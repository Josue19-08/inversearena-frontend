import { useState, useEffect, useRef, useCallback } from 'react';

// Types for the hook
export interface UseArenaTimerOptions {
  initialSeconds: number;
  onTimeUp?: () => void;
}

export interface UseArenaTimerReturn {
  // State values
  rawSeconds: number;
  formattedTime: string;
  progress: number;
  isTensionMode: boolean;
  
  // Control methods
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  sync: (serverSeconds: number) => void;
}

/**
 * Specialized hook for Arena countdown timers with high-precision timing,
 * tension mode detection, and server synchronization capabilities.
 */
export function useArenaTimer({ 
  initialSeconds, 
  onTimeUp 
}: UseArenaTimerOptions): UseArenaTimerReturn {
  // Core state
  const [rawSeconds, setRawSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  // Refs for interval management and timing precision
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number | null>(null);