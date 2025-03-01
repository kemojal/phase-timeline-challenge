import { useCallback, useState } from "react";
import NumberInput from "../NumberInput";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  const [duration, setDuration] = useState(2000);

  // TODO: implement time <= maxTime

  // Ensure time does not exceed duration on mount
  if (time > duration) {
    setTime(duration);
  }

  const onTimeChange = useCallback(
    (newTime: number) => {
      // Ensure time is within bounds, multiple of 10, and positive
      const normalizedTime = Math.max(
        0,
        Math.min(Math.round(newTime / 10) * 10, duration)
      );
      setTime(normalizedTime);
    },
    [setTime, duration]
  );

  const onDurationChange = useCallback(
    (newDuration: number) => {
      // Round the new duration value to the nearest multiple of 10
      const roundedDuration = Math.round(newDuration / 10) * 10;
      const normalizedDuration = Math.max(100, Math.min(6000, roundedDuration));

      // If new duration is less than current time, update time first
      if (normalizedDuration < time) {
        setTime(normalizedDuration);
      }

      // Then update duration
      setDuration(normalizedDuration);

      // Also update current time to ensure it doesn't exceed new duration
      if (time > normalizedDuration) {
        setTime(normalizedDuration);
      }
    },
    [time, setTime, setDuration]
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
          data-testid="duration-input"
        />
        Duration
      </fieldset>
    </div>
  );
};
