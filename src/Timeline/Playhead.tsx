import { useTimelineStore } from "../stores/timelineStore";



export const Playhead = () => {

  const { time, duration, scrollLeft } = useTimelineStore();
  const timelineWidth = duration; // Assuming the timeline width is equal to the duration
  const playheadPosition = time - scrollLeft;
  const isVisible = playheadPosition >= 0 && playheadPosition <= timelineWidth;

  return (
    <div
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
      data-testid="playhead"
      hidden={!isVisible}
      style={{
        transform: `translateX(calc(${time - scrollLeft}px - 50%))`, // Adjust position based on scroll
        left: "316px", // Maintain position within the timeline
      }}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
