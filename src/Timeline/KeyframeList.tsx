import { RefObject, useEffect } from "react";
import { Segment } from "./Segment";

interface KeyframeListProps {
  duration: number;
  keyframeListRef: RefObject<HTMLDivElement>;
  rulerRef: RefObject<HTMLDivElement>;
}

export const KeyframeList = ({
  duration,
  keyframeListRef,
  rulerRef,
}: KeyframeListProps) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  // Sync horizontal scrolling with Ruler
  useEffect(() => {
    const syncHorizontalScroll = () => {
      if (rulerRef.current && keyframeListRef.current) {
        rulerRef.current.scrollLeft = keyframeListRef.current.scrollLeft;
      }
    };

    keyframeListRef.current?.addEventListener("scroll", syncHorizontalScroll);

    return () => {
      keyframeListRef.current?.removeEventListener(
        "scroll",
        syncHorizontalScroll
      );
    };
  }, [keyframeListRef, rulerRef]);
  

  return (
    <div
      ref={keyframeListRef}
      className="overflow-auto px-4 min-w-0"
      data-testid="keyframe-list"
      style={{ minHeight: "100%" }}
    >
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
    </div>
  );
};
