import { render, fireEvent, screen } from "@testing-library/react";
import { Ruler } from "../Ruler";
import { Timeline } from "../Timeline";

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

  test("mousemove without button pressed should not update time", () => {
    const setTimeMock = jest.fn();
    const duration = 1000;
    const rulerRef = { current: document.createElement("div") };

    render(
      <Ruler setTime={setTimeMock} duration={duration} rulerRef={rulerRef} />
    );

    const ruler = screen.getByTestId("ruler");

    // Simulate mousemove without mousedown first
    fireEvent.mouseMove(ruler, { clientX: 216, buttons: 0 });

    // setTime should not be called
    expect(setTimeMock).not.toHaveBeenCalled();
  });

  //   // Test for scrolling synchronization between Ruler and KeyframeList
  //   test("horizontal scrolling is synchronized between ruler and keyframe list", () => {
  //     render(<Timeline />);

  //     const ruler = screen.getByTestId("ruler");
  //     const keyframeList = screen.getByTestId("keyframe-list");

  //     // Mock scrollLeft property
  //     Object.defineProperty(ruler, "scrollLeft", {
  //       configurable: true,
  //       get: jest.fn(() => 0),
  //       set: jest.fn(),
  //     });

  //     Object.defineProperty(keyframeList, "scrollLeft", {
  //       configurable: true,
  //       get: jest.fn(() => 0),
  //       set: jest.fn(),
  //     });

  //     // Trigger scroll event on ruler
  //     fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });

  //     // Check if keyframeList.scrollLeft was set to 200
  //     expect(keyframeList.scrollLeft).toBe(200);

  //     // Trigger scroll event on keyframeList
  //     fireEvent.scroll(keyframeList, { target: { scrollLeft: 300 } });

  //     // Check if ruler.scrollLeft was set to 300
  //     expect(ruler.scrollLeft).toBe(300);
  //   });

  // Test ruler length visual representation and updates
  test("ruler length visually represents the total duration with 1ms = 1px ratio", () => {
    render(<Timeline />);

    const rulerBar = screen.getByTestId("ruler-bar");

    // Initial duration is 1000, so width should be 1000px
    expect(rulerBar).toHaveStyle("width: 1000px");
  });

//   test("ruler length updates when duration changes through PlayControls", async () => {
//     const user = userEvent.setup();
//     render(<Timeline />);

//     // Get the ruler bar and duration input using the correct data-testid
//     const rulerBar = screen.getByTestId("ruler-bar");
//     const durationInput = screen.getByTestId("duration-input");

//     // Check initial width
//     expect(rulerBar).toHaveStyle("width: 1000px");

//     // Change duration to 2000 and press Enter
//     await user.clear(durationInput);
//     await user.type(durationInput, "2000");
//     fireEvent.keyDown(durationInput, { key: "Enter", code: "Enter" });

//     // Check updated width
//     expect(rulerBar).toHaveStyle("width: 2000px");

//     // Change duration to 3000 and blur (lose focus)
//     await user.clear(durationInput);
//     await user.type(durationInput, "3000");
//     fireEvent.blur(durationInput);

//     // Check updated width again
//     expect(rulerBar).toHaveStyle("width: 3000px");

//     // Test arrow keys
//     await user.clear(durationInput);
//     await user.type(durationInput, "3000");
//     fireEvent.keyDown(durationInput, { key: "ArrowUp", code: "ArrowUp" });

//     // Assuming ArrowUp increases by 10 (based on step="10" in the input)
//     expect(rulerBar).toHaveStyle("width: 3010px");

//     fireEvent.keyDown(durationInput, { key: "ArrowDown", code: "ArrowDown" });
//     // Back to 3000
//     expect(rulerBar).toHaveStyle("width: 3000px");
//   });
 // Test for integration with Playhead position
 test('updating time via ruler updates playhead position', async () => {
    render(<Timeline />);
    
    const ruler = screen.getByTestId('ruler');
    const playhead = screen.getByTestId('playhead');
    
    // Mock getBoundingClientRect
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
      toJSON: () => {}
    }));
    
    // Initial position should be 0
    expect(playhead).toHaveStyle('transform: translateX(calc(0px - 50%))');
    
    // Click at position 200 on the ruler (accounting for padding)
    fireEvent.mouseDown(ruler, { clientX: 216, buttons: 1 });
    
    // Check if playhead position was updated to 200px
    expect(playhead).toHaveStyle('transform: translateX(calc(200px - 50%))');
    
    // Restore the original method
    ruler.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
