import { MouseEvent, RefObject } from "react";
import { useTimeControl } from "../hooks/useTimeControl";

interface RulerProps {
  rulerRef: RefObject<HTMLDivElement>;
}

export const Ruler = ({ rulerRef }: RulerProps) => {
  const { setTime, duration } = useTimeControl();
  let padding = 16;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only track when mouse is pressed
    updateTime(e);
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    updateTime(event);
  };

  const updateTime = (e: MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - padding;
    const scrollOffset = e.currentTarget.scrollLeft;
    const totalX = clickX + scrollOffset;

    // Round to the nearest 10
    const roundedTime = Math.round(totalX / 10) * 10;
    // Ensure we don't go below 0 and validate through hook
    setTime(Math.max(0, roundedTime));
  };

  return (
    <div
      ref={rulerRef}
      className="overflow-x-auto overflow-y-hidden px-4 py-2 min-w-0 border-b border-gray-700 border-solid select-none"
      data-testid="ruler"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{ width: `${duration}px` }}
        data-testid="ruler-bar"
        className="h-6 rounded-md bg-white/25"
      ></div>
    </div>
  );
};
