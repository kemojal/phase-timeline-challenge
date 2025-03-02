import { render, screen } from "@testing-library/react";
import { Playhead } from "../Playhead";
import * as timelineStore from "../../stores/timelineStore";

// Mock the Zustand store
jest.mock("../../stores/timelineStore", () => ({
  useTimelineStore: jest.fn(),
}));

describe("Playhead Component", () => {
  const duration = 1000;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
    // Initial store state
    const mockStore = {
      time: 500,
      duration,
      scrollLeft: 0,
      setTime: jest.fn(),
      setScrollLeft: jest.fn(),
      setDuration: jest.fn(),
    };

    // Set up store mock
    jest
      .spyOn(timelineStore, "useTimelineStore")
      .mockImplementation(() => mockStore);

    const { rerender } = render(<Playhead />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle(`transform: translateX(calc(500px - 50%))`);

    // Update scrollLeft
    mockStore.scrollLeft = 100;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
  });

  test("Playhead maintains its relative position during horizontal scrolling", () => {
    // Initial store state
    const mockStore = {
      time: 600,
      duration,
      scrollLeft: 200,
      setTime: jest.fn(),
      setScrollLeft: jest.fn(),
      setDuration: jest.fn(),
    };

    // Set up store mock
    jest
      .spyOn(timelineStore, "useTimelineStore")
      .mockImplementation(() => mockStore);

    const { rerender } = render(<Playhead />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);

    // Update time and scrollLeft
    mockStore.time = 700;
    mockStore.scrollLeft = 300;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
  });

  test("Playhead is visible only when within the Timeline's visible area", () => {
    // Initial store state
    const mockStore = {
      time: 500,
      duration,
      scrollLeft: 100,
      setTime: jest.fn(),
      setScrollLeft: jest.fn(),
      setDuration: jest.fn(),
    };

    // Set up store mock
    jest
      .spyOn(timelineStore, "useTimelineStore")
      .mockImplementation(() => mockStore);

    const { rerender } = render(<Playhead />);
    const playhead = screen.getByTestId("playhead");

    // Test when playhead is within visible area
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is at the start of visible area
    mockStore.time = 100;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is at the end of visible area
    mockStore.time = 1000;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is before visible area
    mockStore.time = 50;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).toHaveAttribute("hidden");

    // Test when playhead is after visible area
    mockStore.time = 1200;
    jest.spyOn(timelineStore, "useTimelineStore").mockImplementation(() => ({
      ...mockStore,
    }));
    rerender(<Playhead />);
    expect(playhead).toHaveAttribute("hidden");
  });
});
