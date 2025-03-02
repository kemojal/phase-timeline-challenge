import { render, screen } from "@testing-library/react";
import { Playhead } from "../Playhead";

describe("Playhead Component", () => {
  const duration = 1000; // Timeline width/duration in pixels/ms

  test("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
    const { rerender } = render(
      <Playhead time={500} scrollLeft={0} duration={duration} />
    );

    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle(`transform: translateX(calc(500px - 50%))`);

    rerender(<Playhead time={500} scrollLeft={100} duration={duration} />);
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
  });

  test("Playhead maintains its relative position during horizontal scrolling", () => {
    const { rerender } = render(
      <Playhead time={600} scrollLeft={200} duration={duration} />
    );

    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);

    rerender(<Playhead time={700} scrollLeft={300} duration={duration} />);
    expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
  });

  test("Playhead is visible only when within the Timeline's visible area", () => {
    // Test when playhead is within visible area
    const { rerender } = render(
      <Playhead time={500} scrollLeft={100} duration={duration} />
    );
    const playhead = screen.getByTestId("playhead");
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is at the start of visible area
    rerender(<Playhead time={100} scrollLeft={100} duration={duration} />);
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is at the end of visible area
    rerender(<Playhead time={1000} scrollLeft={100} duration={duration} />);
    expect(playhead).not.toHaveAttribute("hidden");

    // Test when playhead is before visible area
    rerender(<Playhead time={50} scrollLeft={100} duration={duration} />);
    expect(playhead).toHaveAttribute("hidden");

    // Test when playhead is after visible area
    rerender(<Playhead time={1200} scrollLeft={100} duration={duration} />);
    expect(playhead).toHaveAttribute("hidden");
  });
});
