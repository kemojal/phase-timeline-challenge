import { render, screen, fireEvent } from "@testing-library/react";
import { Ruler } from "../Ruler";
import { Timeline } from "../Timeline";
import * as timelineStore from "../../stores/timelineStore";

// Mock the Zustand store
jest.mock("../../stores/timelineStore", () => ({
  useTimelineStore: jest.fn(),
}));

describe("Ruler Component", () => {
  const duration = 1000;
  const setTimeMock = jest.fn();
  const rulerRef = { current: document.createElement("div") };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up mock implementation for useTimelineStore
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      time: 0,
      duration,
      setTime: setTimeMock,
      scrollLeft: 0,
      setScrollLeft: jest.fn(),
    }));
  });

  test("clicking on the ruler updates the current time and playhead position", async () => {
    render(<Ruler rulerRef={rulerRef} />);
    const ruler = screen.getByTestId("ruler");

    // Mock the getBoundingClientRect to return a consistent position
    const originalGetBoundingClientRect = ruler.getBoundingClientRect;
    ruler.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 1000,
      height: 40,
      right: 1000,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Click at position 100 on the ruler (accounting for 16px padding)
    fireEvent.mouseDown(ruler, { clientX: 116, buttons: 1 });

    // Check if setTime was called with the expected value (100)
    expect(setTimeMock).toHaveBeenCalledWith(100);

    // Restore the original method
    ruler.getBoundingClientRect = originalGetBoundingClientRect;
  });

  test("dragging on the ruler updates the current time continuously", () => {
    render(<Ruler rulerRef={rulerRef} />);
    const ruler = screen.getByTestId("ruler");

    // Mock the getBoundingClientRect
    const originalGetBoundingClientRect = ruler.getBoundingClientRect;
    ruler.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 1000,
      height: 40,
      right: 1000,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Simulate mousedown followed by mousemove events
    fireEvent.mouseDown(ruler, { clientX: 116, buttons: 1 }); // Click at 100px (116 - 16 padding)
    fireEvent.mouseMove(ruler, { clientX: 216, buttons: 1 }); // Drag to 216px (200px adjusted for padding)
    fireEvent.mouseMove(ruler, { clientX: 316, buttons: 1 }); // Drag to 316px (300px adjusted for padding)

    // Check if setTime was called with the expected values
    expect(setTimeMock).toHaveBeenCalledTimes(3);
    expect(setTimeMock).toHaveBeenNthCalledWith(1, 100);
    expect(setTimeMock).toHaveBeenNthCalledWith(2, 200);
    expect(setTimeMock).toHaveBeenNthCalledWith(3, 300);

    // Restore the original method
    ruler.getBoundingClientRect = originalGetBoundingClientRect;
  });

  test("mousemove without button pressed should not update time", () => {
    render(<Ruler rulerRef={rulerRef} />);
    const ruler = screen.getByTestId("ruler");

    // Simulate mousemove without mousedown first
    fireEvent.mouseMove(ruler, { clientX: 216, buttons: 0 });

    // setTime should not be called
    expect(setTimeMock).not.toHaveBeenCalled();
  });

  test("horizontal scrolling is synchronized between ruler and keyframe list", () => {
    render(<Timeline />);

    const ruler = screen.getByTestId("ruler");
    const keyframeList = screen.getByTestId("keyframe-list");

    // Initial scroll position should be 0
    expect(ruler.scrollLeft).toBe(0);
    expect(keyframeList.scrollLeft).toBe(0);

    // Scroll ruler to 100px
    fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });

    // Both elements should be scrolled to 100px
    expect(ruler.scrollLeft).toBe(100);
    expect(keyframeList.scrollLeft).toBe(100);

    // Scroll keyframe list to 200px
    fireEvent.scroll(keyframeList, { target: { scrollLeft: 200 } });

    // Both elements should be scrolled to 200px
    expect(ruler.scrollLeft).toBe(200);
    expect(keyframeList.scrollLeft).toBe(200);

    // Scroll ruler to 300px
    fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });

    // Both elements should be scrolled to 300px
    const rulerScrollLeft = ruler.scrollLeft;
    const keyframeListScrollLeft = keyframeList.scrollLeft;

    expect(rulerScrollLeft).toBe(300);
    expect(keyframeListScrollLeft).toBe(300);
  });

  test("ruler length visually represents the total duration with 1ms = 1px ratio", () => {
    // Set up initial store mock with 1000ms duration
    const mockStore = {
      time: 0,
      duration: 1000,
      setTime: jest.fn(),
      scrollLeft: 0,
      setScrollLeft: jest.fn(),
    };
    jest
      .spyOn(timelineStore, "useTimelineStore")
      .mockImplementation(() => mockStore);

    const { rerender } = render(<Ruler rulerRef={rulerRef} />);
    const rulerBar = screen.getByTestId("ruler-bar");
    expect(rulerBar).toHaveStyle("width: 1000px");

    // Update duration to 2000ms
    mockStore.duration = 2000;
    rerender(<Ruler rulerRef={rulerRef} />);
    expect(rulerBar).toHaveStyle("width: 2000px");
  });

  test("ruler length updates when duration changes through PlayControls", () => {
    // Set up initial store mock with 1000ms duration
    const mockStore = {
      time: 0,
      duration: 1000,
      setTime: jest.fn(),
      scrollLeft: 0,
      setScrollLeft: jest.fn(),
      setDuration: jest.fn().mockImplementation((newDuration) => {
        // Update the store's duration value
        mockStore.duration = newDuration;
        // Trigger a re-render by updating the mock implementation
        jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
          ...mockStore
        }));
      }),
    };

    // Initial store setup
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => mockStore);

    const { rerender } = render(<Timeline />);

    // Get the ruler bar and duration input
    const rulerBar = screen.getByTestId("ruler-bar");
    const durationInput = screen.getByTestId("duration-input");

    // Check initial width
    expect(rulerBar).toHaveStyle("width: 1000px");

    // Change duration to 2000 through PlayControls
    fireEvent.change(durationInput, { target: { value: "2000" } });
    fireEvent.blur(durationInput);
    rerender(<Timeline />);

    // Check that the ruler bar width updated
    expect(rulerBar).toHaveStyle("width: 2000px");

    // Try setting an invalid duration (should be clamped to 6000)
    fireEvent.change(durationInput, { target: { value: "7000" } });
    fireEvent.blur(durationInput);
    rerender(<Timeline />);
    expect(rulerBar).toHaveStyle("width: 6000px");

    // Try setting a duration below minimum (should be clamped to 100)
    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    rerender(<Timeline />);
    expect(rulerBar).toHaveStyle("width: 100px");
  });

  test("updating time via ruler updates playhead position", async () => {
    render(<Timeline />);
  });
});
