import { useEffect, useRef } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { useTimelineStore } from "../stores/timelineStore";

export const Timeline = () => {
  const { setScrollLeft } = useTimelineStore();

  const rulerRef = useRef<HTMLDivElement | null>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);

  // Synchronize horizontal scrolling between Ruler and KeyframeList
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const source = event.target as HTMLElement;
      const ruler = rulerRef.current;
      const keyframeList = keyframeListRef.current;

      if (!ruler || !keyframeList) return;

      const newScrollLeft = source.scrollLeft;
      setScrollLeft(newScrollLeft); // Update store instead of local state

      if (source === ruler) {
        keyframeList.scrollLeft = ruler.scrollLeft;
      } else if (source === keyframeList) {
        ruler.scrollLeft = keyframeList.scrollLeft;
      }
    };

    const ruler = rulerRef.current;
    const keyframeList = keyframeListRef.current;

    if (ruler && keyframeList) {
      ruler.addEventListener("scroll", handleScroll);
      keyframeList.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ruler && keyframeList) {
        ruler.removeEventListener("scroll", handleScroll);
        keyframeList.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setScrollLeft]);

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls />
      <Ruler rulerRef={rulerRef} />
      <TrackList
        trackListRef={trackListRef}
        keyframeListRef={keyframeListRef}
      />
      <KeyframeList
        keyframeListRef={keyframeListRef}
        rulerRef={rulerRef}
        trackListRef={trackListRef}
      />
      <Playhead />
    </div>
  );
};
