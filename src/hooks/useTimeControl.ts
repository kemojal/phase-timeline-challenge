import { useCallback } from "react";
import { useTimelineStore } from "../stores/timelineStore";

export interface TimeControlOptions {
  /** Minimum allowed time value in milliseconds */
  minTime?: number;
  /** Maximum allowed time value (defaults to duration) */
  maxTime?: number;
  /** Minimum allowed duration in milliseconds */
  minDuration?: number;
  /** Maximum allowed duration in milliseconds */
  maxDuration?: number;
}

interface TimeControlActions {
  /** Set the current time with validation */
  setTime: (time: number) => void;
  /** Set the duration with validation */
  setDuration: (duration: number) => void;
  /** Jump to start of timeline */
  jumpToStart: () => void;
  /** Jump to end of timeline */
  jumpToEnd: () => void;
  /** Move time forward by specified amount */
  moveForward: (amount: number) => void;
  /** Move time backward by specified amount */
  moveBackward: (amount: number) => void;
  /** Check if time can move forward */
  canMoveForward: (amount?: number) => boolean;
  /** Check if time can move backward */
  canMoveBackward: (amount?: number) => boolean;
}

interface TimeControlState {
  /** Current time in milliseconds */
  time: number;
  /** Total duration in milliseconds */
  duration: number;
  /** Whether current time is at the start */
  isAtStart: boolean;
  /** Whether current time is at the end */
  isAtEnd: boolean;
}

/**
 * Custom hook for timeline time control with validation
 * @param options Configuration options for time control
 * @returns Time control state and actions
 */
export function useTimeControl(
  options: TimeControlOptions = {}
): TimeControlState & TimeControlActions {
  const {
    minTime = 0,
    maxTime: maxTimeOption,
    minDuration = 100,
    maxDuration = 6000,
  } = options;

  const time = useTimelineStore((state) => state.time);
  const duration = useTimelineStore((state) => state.duration);
  const setStoreTime = useTimelineStore((state) => state.setTime);
  const setStoreDuration = useTimelineStore((state) => state.setDuration);

  // Calculate maxTime based on duration if not provided
  const maxTime = maxTimeOption ?? duration;

  // Validate and clamp time value
  const validateTime = useCallback(
    (newTime: number, newDuration?: number): number => {
      // If a new duration is provided, use it as the max time
      const effectiveMaxTime =
        newDuration !== undefined
          ? Math.min(maxTimeOption ?? newDuration, newDuration)
          : maxTime;
      return Math.max(minTime, Math.min(newTime, effectiveMaxTime));
    },
    [minTime, maxTime, maxTimeOption, duration]
  );

  // Validate and clamp duration value
  const validateDuration = useCallback(
    (newDuration: number): number => {
      return Math.max(minDuration, Math.min(newDuration, maxDuration));
    },
    [minDuration, maxDuration]
  );

  // Time control actions
  const setTime = useCallback(
    (newTime: number) => {
      const validTime = validateTime(newTime);
      if (validTime !== time) {
        setStoreTime(validTime);
      }
    },
    [setStoreTime, validateTime, time]
  );

  const setDuration = useCallback(
    (newDuration: number) => {
      const validDuration = validateDuration(newDuration);
      setStoreDuration(validDuration);

      // Ensure time is still valid with new duration
      // Pass the new duration to validateTime to use as max
      const validTime = validateTime(time, validDuration);
      if (validTime !== time) {
        setStoreTime(validTime);
      }
    },
    [setStoreDuration, validateDuration, setStoreTime, validateTime, time]
  );

  const jumpToStart = useCallback(() => {
    setTime(minTime);
  }, [setTime, minTime]);

  const jumpToEnd = useCallback(() => {
    setTime(maxTime);
  }, [setTime, maxTime]);

  const moveForward = useCallback(
    (amount: number) => {
      setTime(time + amount);
    },
    [setTime, time]
  );

  const moveBackward = useCallback(
    (amount: number) => {
      setTime(time - amount);
    },
    [setTime, time]
  );

  const canMoveForward = useCallback(
    (amount = 0): boolean => {
      return time + amount <= maxTime;
    },
    [time, maxTime]
  );

  const canMoveBackward = useCallback(
    (amount = 0): boolean => {
      return time - amount >= minTime;
    },
    [time, minTime]
  );

  return {
    // State
    time,
    duration,
    isAtStart: time <= minTime,
    isAtEnd: time >= maxTime,

    // Actions
    setTime,
    setDuration,
    jumpToStart,
    jumpToEnd,
    moveForward,
    moveBackward,
    canMoveForward,
    canMoveBackward,
  };
}
