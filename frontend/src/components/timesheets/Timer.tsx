import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

interface TimerProps {
  startTime: Date | string;
  endTime?: Date | string | null;
}

export function Timer({ startTime, endTime }: TimerProps) {
  const [elapsed, setElapsed] = useState<string>("0:00:00");

  useEffect(() => {
    // Convert string dates to Date objects if needed
    const start = startTime instanceof Date ? startTime : new Date(startTime);

    // Function to calculate and format elapsed time
    const updateElapsed = () => {
      // If there's an end time, calculate the fixed duration
      if (endTime) {
        const end = endTime instanceof Date ? endTime : new Date(endTime);
        const durationMs = end.getTime() - start.getTime();
        if (durationMs >= 0) {
          setElapsed(formatDuration(durationMs));
        } else {
          setElapsed("0:00:00"); // Fallback for invalid duration
        }
        return;
      }

      // For ongoing timers, calculate elapsed time from start to now
      const now = new Date();
      const durationMs = now.getTime() - start.getTime();
      if (durationMs >= 0) {
        setElapsed(formatDuration(durationMs));
      } else {
        setElapsed("0:00:00"); // Fallback for invalid duration
      }
    };

    // Initial update
    updateElapsed();

    // Only set up interval for ongoing timers
    if (!endTime) {
      const intervalId = setInterval(updateElapsed, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, endTime]);

  return <span className="text-3xl font-mono text-center">{elapsed}</span>;
}
