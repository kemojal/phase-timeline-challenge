import { MouseEvent, RefObject, useCallback } from "react";
import { useTimeControl } from "../hooks/useTimeControl";

interface RulerProps {
  rulerRef: RefObject<HTMLDivElement>;
}

const DurationKnob = ({
  duration,
  onDurationChange,
  rulerRef,
  setTime,
  time,
}: {
  duration: number;
  onDurationChange: (newDuration: number) => void;
  rulerRef: RefObject<HTMLDivElement>;
  setTime: (time: number) => void;
  time: number;
}) => {
  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startDuration = duration;

      const handleMouseMove = (e: MouseEvent) => {
        if (!rulerRef.current) return;

        // Update duration based on drag
        const deltaX = e.clientX - startX;
        const newDuration = Math.max(
          100,
          Math.round((startDuration + deltaX) / 10) * 10
        );
        onDurationChange(newDuration);

        // Only update playhead when reducing duration and current time is beyond new duration
        if (deltaX < 0 && time > newDuration) {
          setTime(newDuration);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [duration, onDurationChange, rulerRef, setTime, time]
  );

  return (
    <div
      className="group absolute -top-1 -right-1.5 z-50 flex h-8 w-1 cursor-ew-resize flex-col items-center justify-center gap-[2px] rounded-xs bg-[#272525]/80 shadow-lg backdrop-blur-sm transition-all hover:bg-[#272525]/80 active:bg-[#272525]/80 touch-none"
      onMouseDown={handleMouseDown}
      data-testid="duration-knob"
    >
      {/* Duration tooltip */}
      <div className="absolute -top-5 px-1 py-0.5 text-[10px] text-white rounded shadow-xl opacity-0 transition-opacity bg-gray-900/90 group-hover:opacity-100 whitespace-nowrap">
        {(duration / 1000).toFixed(1)}s
      </div>

      {/* Grip lines */}
      <div className="flex flex-col gap-[2px]">
        <div className="h-[1px] w-1.5 rounded-full bg-white/60 group-hover:bg-white/80" />
        <div className="h-[1px] w-1.5 rounded-full bg-white/60 group-hover:bg-white/80" />
        <div className="h-[1px] w-1.5 rounded-full bg-white/60 group-hover:bg-white/80" />
      </div>

      {/* Side indicators */}
      <div className="absolute -left-0.5 top-1/2 h-3 w-[1px] -translate-y-1/2 rounded-full bg-white/20 group-hover:bg-white/30" />
      <div className="absolute -right-0.5 top-1/2 h-3 w-[1px] -translate-y-1/2 rounded-full bg-white/20 group-hover:bg-white/30" />
    </div>
  );
};

export const Ruler = ({ rulerRef }: RulerProps) => {
  const { setTime, time, duration, setDuration } = useTimeControl();
  let padding = 16;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only track when mouse is pressed
    updateTime(e);
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-testid="duration-knob"]')) {
      return; // Don't handle mousedown if clicking the knob
    }
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
      className="overflow-x-auto overflow-y-hidden relative px-4 py-2 min-w-0 border-b border-gray-700 border-solid select-none"
      data-testid="ruler"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{ width: `${duration}px` }}
        data-testid="ruler-bar"
        className="relative h-6 rounded-md bg-white/10"
      >
        <div className="flex relative items-center w-full h-full">
          {renderMarkers()}
        </div>

        <DurationKnob
          duration={duration}
          onDurationChange={setDuration}
          rulerRef={rulerRef}
          setTime={setTime}
          time={time}
        />
      </div>
    </div>
  );
};
