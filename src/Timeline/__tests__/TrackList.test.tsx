import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { TrackList } from "../TrackList";
import { KeyframeList } from "../KeyframeList";

const TestWrapper = () => {
  const trackListRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <TrackList
        trackListRef={trackListRef}
        keyframeListRef={keyframeListRef}
      />
      <KeyframeList
        duration={1000}
        keyframeListRef={keyframeListRef}
        rulerRef={{ current: null }}
        trackListRef={trackListRef}
      />
    </div>
  );
};

describe("Track List Component", () => {
  test("Vertical scrolling of Track List syncs with Keyframe List", async () => {
    render(<TestWrapper />);

    const trackList = screen.getByTestId("track-list");
    const keyframeList = screen.getByTestId("keyframe-list");

    expect(trackList).toBeInTheDocument();
    expect(keyframeList).toBeInTheDocument();

    // Simulate scrolling in Track List
    trackList.scrollTop = 50;
    trackList.dispatchEvent(new Event("scroll"));

    // Ensure Keyframe List is synced
    expect(keyframeList.scrollTop).toBe(50);

    // Simulate scrolling in Keyframe List
    keyframeList.scrollTop = 100;
    keyframeList.dispatchEvent(new Event("scroll"));

    // Ensure Track List is synced
    expect(trackList.scrollTop).toBe(100);
  });
});
