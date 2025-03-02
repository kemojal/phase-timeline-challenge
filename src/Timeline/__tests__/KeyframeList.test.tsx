import { render, fireEvent, screen } from "@testing-library/react";
import { KeyframeList } from "../KeyframeList";
import { createRef, RefObject } from "react";

describe("KeyframeList Component", () => {
  let keyframeListRef: RefObject<HTMLDivElement>;
  let rulerRef: RefObject<HTMLDivElement>;
  let trackListRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    keyframeListRef = createRef<HTMLDivElement>();
    rulerRef = createRef<HTMLDivElement>();
    trackListRef = createRef<HTMLDivElement>();

    render(
      <div>
        <div ref={trackListRef} data-testid="track-list" style={{ overflow: "auto", height: "200px" }}></div>
        <div ref={rulerRef} data-testid="ruler" style={{ overflowX: "auto", width: "500px" }}></div>
        <KeyframeList duration={1000} keyframeListRef={keyframeListRef} rulerRef={rulerRef} trackListRef={trackListRef} />
      </div>
    );
  });

  test("vertical scrolling is synchronized with TrackList", () => {
    const keyframeList = screen.getByTestId("keyframe-list");
    const trackList = screen.getByTestId("track-list");

    // Create scroll value trackers
    let keyframeListScrollTop = 0;
    let trackListScrollTop = 0;

    // Mock scrollTop for keyframeList
    Object.defineProperty(keyframeList, "scrollTop", {
      configurable: true,
      get: () => keyframeListScrollTop,
      set: (value) => {
        keyframeListScrollTop = value;
      },
    });

    // Mock scrollTop for trackList
    Object.defineProperty(trackList, "scrollTop", {
      configurable: true,
      get: () => trackListScrollTop,
      set: (value) => {
        trackListScrollTop = value;
      },
    });

    // Trigger scroll event on keyframeList
    fireEvent.scroll(keyframeList, { target: { scrollTop: 100 } });
    
    // Check if trackList scrolled to match keyframeList
    expect(trackListScrollTop).toBe(100);
  });

});
