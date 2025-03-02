import { MouseEvent, useRef } from "react";

interface RulerProps {
  time?: number;
  setTime: (time: number) => void;
}

export const Ruler = ({
  //  time,
  setTime,
}: RulerProps) => {
  const rulerRef = useRef<HTMLDivElement | null>(null);
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
    // Ensure we don't go below 0
    const newTime = Math.max(0, roundedTime);

    setTime(newTime);
  };
  // TODO: implement mousedown and mousemove to update time and Playhead position

  return (
    <div
      ref={rulerRef}
      className="overflow-x-auto overflow-y-hidden px-4 py-2 min-w-0 border-b border-gray-700 border-solid"
      data-testid="ruler"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        className="w-[2000px] h-6 rounded-md bg-white/25"
        data-testid="ruler-bar"
      ></div>
    </div>
  );
};
