import { render, fireEvent, screen } from "@testing-library/react";
import { Ruler } from "../Ruler";

describe("Ruler Component", () => {
  test("clicking on the ruler updates the current time and playhead position", async () => {
    // mock function to track setTime calls
    const setTimeMock = jest.fn();
    const duration = 1000;
    const rulerRef = { current: document.createElement("div") };

    // Render the ruler component with mocked props
    render(
      <Ruler setTime={setTimeMock} duration={duration} rulerRef={rulerRef} />
    );

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
    // Create a mock function to track setTime calls
    const setTimeMock = jest.fn();
    const duration = 1000;
    const rulerRef = { current: document.createElement("div") };

    // Render the ruler component with mocked props
    render(
      <Ruler setTime={setTimeMock} duration={duration} rulerRef={rulerRef} />
    );

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

    // Drag to 216px (200px adjusted for padding)
    fireEvent.mouseMove(ruler, { clientX: 216, buttons: 1 });

    // Drag to 316px (300px adjusted for padding)
    fireEvent.mouseMove(ruler, { clientX: 316, buttons: 1 });

    // Check if setTime was called with the expected values
    expect(setTimeMock).toHaveBeenCalledTimes(3);
    expect(setTimeMock).toHaveBeenNthCalledWith(1, 100);
    expect(setTimeMock).toHaveBeenNthCalledWith(2, 200);
    expect(setTimeMock).toHaveBeenNthCalledWith(3, 300);

    // Restore the original method
    ruler.getBoundingClientRect = originalGetBoundingClientRect;
  });

  test('mousemove without button pressed should not update time', () => {
    const setTimeMock = jest.fn();
    const duration = 1000;
    const rulerRef = { current: document.createElement('div') };
    
    render(
      <Ruler 
        setTime={setTimeMock} 
        duration={duration} 
        rulerRef={rulerRef} 
      />
    );
    
    const ruler = screen.getByTestId('ruler');
    
    // Simulate mousemove without mousedown first
    fireEvent.mouseMove(ruler, { clientX: 216, buttons: 0 });
    
    // setTime should not be called
    expect(setTimeMock).not.toHaveBeenCalled();
  });

});
