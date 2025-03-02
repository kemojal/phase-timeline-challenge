import { useEffect, useRef, useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

export const Timeline = () => {
  // FIXME: performance concerned

  // TODO: optimize the props and scroll syncing logic
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1000);
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

      let newTime = Math.round(source.scrollLeft);  // Convert scroll to time

      setTime(newTime); // Update playhead position

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
  }, []);

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
      />
      <Ruler
        time={time}
        setTime={setTime}
        duration={duration}
        rulerRef={rulerRef}
      />
      <TrackList
        trackListRef={trackListRef}
        keyframeListRef={keyframeListRef}
      />
      <KeyframeList
        duration={duration}
        keyframeListRef={keyframeListRef}
        rulerRef={rulerRef}
        trackListRef={trackListRef}
      />
      <Playhead time={time} />
    </div>
  );
};
