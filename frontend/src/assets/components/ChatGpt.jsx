import { useEffect, useRef, useState, useCallback } from "react";

const STATUS_DURATION = 5000; // 5 seconds per status

function useStatusTimer({ duration, onComplete, isPaused }) {
  const [progress, setProgress] = useState(0);       // 0 to 1
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(null);

  const tick = useCallback((timestamp) => {
    // First frame: record start time
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const newProgress = Math.min(elapsed / duration, 1);
    setProgress(newProgress);

    if (newProgress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      onComplete();
    }
  }, [duration, onComplete]);

  // Start / restart when status changes
  useEffect(() => {
    startTimeRef.current = null;
    pausedAtRef.current = null;
    setProgress(0);
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // Pause / Resume
  useEffect(() => {
    if (isPaused) {
      // Save the moment we paused
      pausedAtRef.current = performance.now();
      cancelAnimationFrame(rafRef.current);
    } else {
      if (pausedAtRef.current !== null) {
        // Shift startTime forward by the time spent paused
        const pausedDuration = performance.now() - pausedAtRef.current;
        startTimeRef.current += pausedDuration;
        pausedAtRef.current = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [isPaused, tick]);

  return progress;
}