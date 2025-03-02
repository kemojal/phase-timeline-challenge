import { useCallback } from "react";
import NumberInput from "../NumberInput";
import { useTimeControl } from "../hooks/useTimeControl";

export const PlayControls = () => {
  const { time, duration, setTime, setDuration } = useTimeControl({
    minTime: 0,
    minDuration: 100,
    maxDuration: 6000,
  });

  const onTimeChange = useCallback(
    (newTime: number) => {
      // Normalize to multiples of 10
      const normalizedTime = Math.round(newTime / 10) * 10;
      setTime(normalizedTime);
    },
    [setTime]
  );

  const onDurationChange = useCallback(
    (newDuration: number) => {
      // Normalize to multiples of 10
      const normalizedDuration = Math.round(newDuration / 10) * 10;
      setDuration(normalizedDuration);
    },
    [setDuration]
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
