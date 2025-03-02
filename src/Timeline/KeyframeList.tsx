import { RefObject, useEffect } from "react";
import { Segment } from "./Segment";
import { useTimelineStore } from "../stores/timelineStore";

interface KeyframeListProps {
  keyframeListRef: RefObject<HTMLDivElement>;
  rulerRef: RefObject<HTMLDivElement>;
  trackListRef: RefObject<HTMLDivElement>;
}

export const KeyframeList = ({
  keyframeListRef,
  rulerRef,
  trackListRef,
}: KeyframeListProps) => {


  const { duration } = useTimelineStore();
  
  // Sync vertical scrolling with `TrackList`
  useEffect(() => {
    const syncVerticalScroll = (e: Event) => {
      if (trackListRef.current && e.target === keyframeListRef.current) {
        trackListRef.current.scrollTop = (e.target as HTMLElement).scrollTop;
      }
    };

    const keyframeList = keyframeListRef.current;
    if (keyframeList) {
      keyframeList.addEventListener("scroll", syncVerticalScroll);
    }

    return () => {
      if (keyframeList) {
        keyframeList.removeEventListener("scroll", syncVerticalScroll);
      }
    };
  }, [keyframeListRef, trackListRef]);

  // Sync horizontal scrolling with `Ruler`
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
