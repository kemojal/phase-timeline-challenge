import { useEffect, useRef } from "react";
import { Segment } from "./Segment";

// interface KeyframeListProps {
//   scrollRef: React.RefObject<HTMLDivElement>;
// }

export const KeyframeList = () => {
  const keyframeListRef = useRef<HTMLDivElement | null>(null);
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  // Sync scroll with Ruler
  useEffect(() => {
    const keyframeList = keyframeListRef.current;
    const ruler = document.querySelector('[data-testid="ruler"]');

    if (!keyframeList || !ruler) return;

    const handleKeyframeScroll = () => {
      if (ruler instanceof HTMLElement) {
        ruler.scrollLeft = keyframeList.scrollLeft;
      }
    };

    keyframeList.addEventListener("scroll", handleKeyframeScroll);

    return () => {
      keyframeList.removeEventListener("scroll", handleKeyframeScroll);
    };
  }, []);

  return (
    <div
      ref={keyframeListRef}
      className="overflow-auto px-4 min-w-0"
      data-testid="keyframe-list"
    >
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
    </div>
  );
};
