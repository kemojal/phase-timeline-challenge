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

  const renderMarkers = () => {
    const markers = [];
    const totalMarkers = Math.ceil(duration / 10); // Every 10px is 10ms

    for (let i = 0; i < totalMarkers; i++) {
      const isMajor = i % 10 === 0; // Major marker every 100ms (100px)
      const isSecond = i % 100 === 0; // Second marker every 1000ms (1000px)
      const position = i * 10;

      markers.push(
        <div
          key={i}
          className={`absolute ${
            isSecond
              ? "h-6 border-l-2 border-white/60"
              : isMajor
              ? "h-3 border-l border-white/40"
              : "h-2 border-l border-white/20"
          }`}
          style={{ left: `${position}px` }}
        >
          {isSecond && (
            <div className="absolute left-1 -top-5 text-xs text-white/60">
              {i / 100}s
            </div>
          )}
        </div>
      );
    }

    return markers;
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
        className="relative h-6 rounded-md bg-white/10"
      >
        {renderMarkers()}
      </div>
    </div>
  );
};
