import { render, fireEvent, screen } from "@testing-library/react";
import { PlayControls } from "../PlayControls";

describe("PlayControls Component", () => {
  let setTime: jest.Mock;

  beforeEach(() => {
    setTime = jest.fn();
    render(<PlayControls time={2000} setTime={setTime} />);
  });

  test("Current Time is always between 0ms and Duration", () => {
    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "-500" } });
    fireEvent.blur(currentTimeInput);
    expect(setTime).toHaveBeenCalledWith(0); // Should be clamped to 0

    setTime.mockClear();

    fireEvent.change(currentTimeInput, { target: { value: "9999" } });
    fireEvent.blur(currentTimeInput);
    expect(setTime).toHaveBeenCalledWith(2000); // Should be clamped to duration (2000 in this case)
  });

  test("Current Time adjusts if it exceeds the newly set Duration", () => {
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "1500" } });
    fireEvent.blur(durationInput);

    expect(setTime).toHaveBeenCalledWith(1500);
  });

  test("Duration is always between 100ms and 6000ms", () => {
    const durationInput = screen.getByTestId(
      "duration-input"
    ) as HTMLInputElement;

    // Test upper bound
    fireEvent.change(durationInput, { target: { value: "7000" } });
    fireEvent.blur(durationInput);
    expect(setTime).toHaveBeenCalledWith(6000);

    // Reset mock
    setTime.mockClear();

    // Test lower bound
    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    expect(setTime).toHaveBeenCalledWith(100);
  });
  test("Current Time and Duration round to nearest multiple of 10ms", () => {
    const durationInput = screen.getByTestId("duration-input");
    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(durationInput, { target: { value: "5983" } });
    fireEvent.blur(durationInput);
    expect(setTime).toHaveBeenCalledWith(5980); // Should round to nearest 10

    setTime.mockClear();

    fireEvent.change(currentTimeInput, { target: { value: "999" } });
    fireEvent.blur(currentTimeInput);
    expect(setTime).toHaveBeenCalledWith(1000); // Should round to 1000ms
  });

  test("Current Time and Duration should always be positive integers", () => {
    const durationInput = screen.getByTestId("duration-input");
    const currentTimeInput = screen.getByTestId("current-time-input");

    // Test negative values
    fireEvent.change(durationInput, { target: { value: "-500" } });
    fireEvent.blur(durationInput);
    expect(setTime).toHaveBeenCalledWith(100); // Should be clamped to 100ms (min valid value)

    setTime.mockClear();

    fireEvent.change(currentTimeInput, { target: { value: "-200" } });
    fireEvent.blur(currentTimeInput);
    expect(setTime).toHaveBeenCalledWith(0); // Should be clamped to 0 (min valid value)

    setTime.mockClear();

    // Test non-integer values
    fireEvent.change(durationInput, { target: { value: "2500.5" } });
    fireEvent.blur(durationInput);
    expect(setTime).toHaveBeenCalledWith(2500); // Should round down to nearest integer

    setTime.mockClear();

    fireEvent.change(currentTimeInput, { target: { value: "1750.9" } });
    fireEvent.blur(currentTimeInput);
    expect(setTime).toHaveBeenCalledWith(1750); // Should round down to nearest integer
  });
});
