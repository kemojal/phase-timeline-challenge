import React, { useCallback } from "react";
import NumberInput from "../NumberInput";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {

  // TODO: implement time <= maxTime

  const onTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(Number(e.target.value));
    },
    [setTime]
  );

  const onDurationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(Number(e.target.value));
    },
    [setTime]
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
          max={2000}
          step={10}
          data-testid="current-time-input"
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
       
        <NumberInput
          value={2000}
          onChange={onDurationChange}
          min={100}
          max={2000}
          step={10}
          data-testid="duration-input"
        />
        Duration
      </fieldset>
    </div>
  );
};
