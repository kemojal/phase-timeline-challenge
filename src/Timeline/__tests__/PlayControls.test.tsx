import { render, fireEvent, screen } from "@testing-library/react";
import { PlayControls } from "../PlayControls";
import { useTimelineStore } from "../../stores/timelineStore";

// Mock the Zustand store
jest.mock("../../stores/timelineStore", () => ({
  useTimelineStore: jest.fn(),
}));

describe("PlayControls Component", () => {
  let mockSetTime: jest.Mock;
  let mockSetDuration: jest.Mock;

  beforeEach(() => {
    mockSetTime = jest.fn();
    mockSetDuration = jest.fn();

    // Setup mock store
    (useTimelineStore as jest.Mock).mockImplementation(() => ({
      time: 2000,
      setTime: mockSetTime,
      duration: 2000,
      setDuration: mockSetDuration,
    }));

    render(<PlayControls />);
  });

  test("Current Time is always between 0ms and Duration", () => {
    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "-500" } });
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(0); // Should be clamped to 0

    mockSetTime.mockClear();

    fireEvent.change(currentTimeInput, { target: { value: "9999" } });
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(2000); // Should be clamped to duration (2000 in this case)
  });

  test("Current Time adjusts if it exceeds the newly set Duration", () => {
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "1500" } });
    fireEvent.blur(durationInput);

    expect(mockSetTime).toHaveBeenCalledWith(1500);
  });

  test("Duration is always between 100ms and 6000ms", () => {
    const durationInput = screen.getByTestId("duration-input");

    // Test upper bound - time shouldn't change since 2000 < 6000
    fireEvent.change(durationInput, { target: { value: "7000" } });
    fireEvent.blur(durationInput);
    expect(mockSetTime).not.toHaveBeenCalled();

    mockSetTime.mockClear();

    // Test lower bound - time should change since 2000 > 100
    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    expect(mockSetTime).toHaveBeenCalledWith(100);
  });

  test("Current Time and Duration round to nearest multiple of 10ms", () => {
    const durationInput = screen.getByTestId("duration-input");
    const currentTimeInput = screen.getByTestId("current-time-input");

    // Duration rounding - time shouldn't change since 2000 < 5980
    fireEvent.change(durationInput, { target: { value: "5983" } });
    fireEvent.blur(durationInput);
    expect(mockSetTime).not.toHaveBeenCalled();

    mockSetTime.mockClear();

    // Time rounding
    fireEvent.change(currentTimeInput, { target: { value: "999" } });
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(1000);
  });

  test("Current Time and Duration should always be positive integers", () => {
    const durationInput = screen.getByTestId("duration-input");
    const currentTimeInput = screen.getByTestId("current-time-input");

    // Negative duration - time should change since 2000 > 100
    fireEvent.change(durationInput, { target: { value: "-500" } });
    fireEvent.blur(durationInput);
    expect(mockSetTime).toHaveBeenCalledWith(100);

    mockSetTime.mockClear();

    // Negative time
    fireEvent.change(currentTimeInput, { target: { value: "-200" } });
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(0);

    mockSetTime.mockClear();

    // Decimal duration - time shouldn't change since 2000 < 2500
    fireEvent.change(durationInput, { target: { value: "2500.5" } });
    fireEvent.blur(durationInput);
    expect(mockSetTime).not.toHaveBeenCalled();

    mockSetTime.mockClear();

    // Decimal time
    fireEvent.change(currentTimeInput, { target: { value: "1750.9" } });
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(1750);
  });

  test("Playhead position updates only after specific actions (blur, Enter, arrow keys)", () => {
    const currentTimeInput = screen.getByTestId("current-time-input");

    // Typing alone should NOT trigger an update
    fireEvent.change(currentTimeInput, { target: { value: "1500" } });
    expect(mockSetTime).not.toHaveBeenCalled(); // Should NOT trigger update yet

    // Pressing Enter should trigger an update
    fireEvent.keyDown(currentTimeInput, { key: "Enter" });
    expect(mockSetTime).toHaveBeenCalledWith(1500); // Now it should update

    mockSetTime.mockClear();

    // Pressing Arrow Up should trigger an update and increment by step (10)
    fireEvent.keyDown(currentTimeInput, { key: "ArrowUp" });
    expect(mockSetTime).toHaveBeenCalledWith(1510); // Should increment by 10

    mockSetTime.mockClear();

    // Pressing Arrow Down should trigger an update and decrement by step (10)
    fireEvent.keyDown(currentTimeInput, { key: "ArrowDown" });
    expect(mockSetTime).toHaveBeenCalledWith(1500); // Should decrement by 10

    mockSetTime.mockClear();

    // Losing focus should trigger an update
    fireEvent.blur(currentTimeInput);
    expect(mockSetTime).toHaveBeenCalledWith(1500); // Should update on blur
  });
});
