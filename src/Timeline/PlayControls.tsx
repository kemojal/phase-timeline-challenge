import { useCallback, useState } from "react";
import NumberInput from "../NumberInput";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  const [duration, setDuration] = useState(2000);

  // Ensure time does not exceed duration on mount
  if (time > duration) {
    setTime(duration);
  }

  const onTimeChange = useCallback(
    (newTime: number) => {
      // First clamp to duration
      const clampedTime = Math.min(newTime, duration);

      // Then ensure it's within bounds and multiple of 10
      const normalizedTime = Math.max(0, Math.round(clampedTime / 10) * 10);

      // Always call setTime with the normalized value
      setTime(normalizedTime);
    },
    [setTime, duration]
  );

  const onDurationChange = useCallback(
    (newDuration: number) => {
      // Round to nearest 10ms and clamp between 100ms and 6000ms
      const roundedDuration = Math.round(newDuration / 10) * 10;
      const normalizedDuration = Math.max(100, Math.min(6000, roundedDuration));

      setDuration(normalizedDuration);

      // Always ensure time is within bounds when duration changes
      if (time > normalizedDuration) {
        setTime(normalizedDuration);
      } else if (normalizedDuration !== duration) {
        // If duration changed, call setTime with the new value
        setTime(normalizedDuration);
      }
    },
    [time, setTime, duration]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    },
    []
  );

  return (
    <div
      className="flex justify-between items-center px-2 border-r border-b border-gray-700 border-solid"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumberInput
          value={time}
          onChange={onTimeChange}
          min={0}
          max={duration}
          step={10}
          onKeyDown={handleKeyDown}
          data-testid="current-time-input"
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInput
          value={duration}
          onChange={onDurationChange}
          min={100}
          max={6000}
          step={10}
          onKeyDown={handleKeyDown}
          data-testid="duration-input"
        />
        Duration
      </fieldset>
    </div>
  );
};
