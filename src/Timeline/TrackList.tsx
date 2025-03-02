import { RefObject } from "react";
import { useScrollSync } from "../hooks/useScrollSync";

interface TrackListProps {
  trackListRef: RefObject<HTMLDivElement>;
  keyframeListRef: RefObject<HTMLDivElement>;
}

export const TrackList = ({
  trackListRef,
  keyframeListRef,
}: TrackListProps) => {
  // Use the new hook for vertical scroll sync only
  useScrollSync(trackListRef, keyframeListRef, {
    vertical: true,
    horizontal: false,
  });

  return (
    <div
      ref={trackListRef}
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700
      overflow-auto"
      data-testid="track-list"
    >
      <div className="p-2">
        <div>Track A</div>
      </div>
      <div className="p-2">
        <div>Track B</div>
      </div>
      <div className="p-2">
        <div>Track C</div>
      </div>
      <div className="p-2">
        <div>Track D</div>
      </div>
      <div className="p-2">
        <div>Track E</div>
      </div>
      <div className="p-2">
        <div>Track F </div>
      </div>
      <div className="p-2">
        <div>Track G</div>
      </div>
      <div className="p-2">
        <div>Track H</div>
      </div>
      <div className="p-2">
        <div>Track I </div>
      </div>
      <div className="p-2">
        <div>Track J</div>
      </div>
    </div>
  );
};
