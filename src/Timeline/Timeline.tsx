import { useEffect, useRef, useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1000);
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);

  // Synchronize horizontal scrolling between Ruler and KeyframeList
  useEffect(() => {
    const syncHorizontalScroll = (
      sourceRef: React.RefObject<HTMLDivElement>,
      targetRef: React.RefObject<HTMLDivElement>
    ) => {
      const handleScroll = (e: Event) => {
        if (
          sourceRef.current &&
          targetRef.current &&
          e.target === sourceRef.current
        ) {
          targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
        }
      };

      sourceRef.current?.addEventListener("scroll", handleScroll);

      return () => {
        sourceRef.current?.removeEventListener("scroll", handleScroll);
      };
    };

    const cleanupRulerToKeyframe = syncHorizontalScroll(
      rulerRef,
      keyframeListRef
    );
    const cleanupKeyframeToRuler = syncHorizontalScroll(
      keyframeListRef,
      rulerRef
    );

    return () => {
      cleanupRulerToKeyframe();
      cleanupKeyframeToRuler();
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
      <TrackList />
      <KeyframeList
        duration={duration}
        keyframeListRef={keyframeListRef}
        rulerRef={rulerRef}
      />
      <Playhead time={time} />
    </div>
  );
};
