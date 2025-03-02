import { renderHook, act } from "@testing-library/react";
import { useTimeControl, TimeControlOptions } from "../useTimeControl";

// Mock store state and functions
let mockState = {
  time: 1000,
  duration: 3000,
};

// Create setters that trigger store updates
const mockSetTime = jest.fn((newTime: number) => {
  mockState = { ...mockState, time: newTime };
});

const mockSetDuration = jest.fn((newDuration: number) => {
  mockState = { ...mockState, duration: newDuration };
});

// Mock the Zustand store with debugging
jest.mock("../../stores/timelineStore", () => {
  const store = (selector: ((state: any) => any) | undefined) => {
    const currentState = {
      ...mockState,
      setTime: mockSetTime,
      setDuration: mockSetDuration,
    };

    if (typeof selector === "function") {
      const result = selector(currentState);
      console.log(
        "Store selector called with state:",
        currentState,
        "returned:",
        result
      );
      return result;
    }
    console.log("Store returning full state:", currentState);
    return currentState;
  };
  return { useTimelineStore: store };
});

describe("useTimeControl Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      time: 1000,
      duration: 3000,
    };
  });

  describe("Initialization", () => {
    it("initializes with default options", () => {
      const { result } = renderHook(() => useTimeControl());

      expect(result.current.time).toBe(1000);
      expect(result.current.duration).toBe(3000);
      expect(result.current.isAtStart).toBe(false);
      expect(result.current.isAtEnd).toBe(false);
    });

    it("respects custom options", () => {
      const options: TimeControlOptions = {
        minTime: 500,
        maxTime: 2000,
        minDuration: 1000,
        maxDuration: 4000,
      };
      const { result } = renderHook(() => useTimeControl(options));

      expect(result.current.time).toBe(1000); // Within bounds
      expect(result.current.duration).toBe(3000); // Within bounds
    });
  });

  describe("Time Control", () => {
    it("validates and rounds time values", () => {
      const { result } = renderHook(() => useTimeControl());

      act(() => {
        result.current.setTime(1234);
      });
      expect(mockSetTime).toHaveBeenCalledWith(1234);

      act(() => {
        result.current.setTime(-500); // Should clamp to 0
      });
      expect(mockSetTime).toHaveBeenCalledWith(0);

      act(() => {
        result.current.setTime(5000); // Should clamp to duration (3000)
      });
      expect(mockSetTime).toHaveBeenCalledWith(3000);
    });

    it("prevents invalid time updates", () => {
      const { result } = renderHook(() => useTimeControl());

      act(() => {
        result.current.setTime(result.current.time); // Same value
      });
      expect(mockSetTime).not.toHaveBeenCalled();
    });
  });

  describe("Duration Control", () => {
    it("validates duration values", () => {
      const { result } = renderHook(() => useTimeControl());

      act(() => {
        result.current.setDuration(1234);
      });
      expect(mockSetDuration).toHaveBeenCalledWith(1234);

      act(() => {
        result.current.setDuration(50); // Should clamp to minDuration (100)
      });
      expect(mockSetDuration).toHaveBeenCalledWith(100);

      act(() => {
        result.current.setDuration(7000); // Should clamp to maxDuration (6000)
      });
      expect(mockSetDuration).toHaveBeenCalledWith(6000);
    });

    it("adjusts time when duration becomes smaller", () => {
      mockState = {
        time: 2500,
        duration: 3000,
      };

      const { result } = renderHook(() => useTimeControl());

      act(() => {
        result.current.setDuration(2000); // Duration < time
      });

      // Duration update should trigger time update
      expect(mockSetDuration).toHaveBeenCalledWith(2000);
      expect(mockSetTime).toHaveBeenCalledWith(2000);
    });
  });

  // !TODO: Fix this test

  // describe("Movement Controls", () => {
  //   it("moves time forward and backward", () => {
  //     const { result } = renderHook(() => useTimeControl());

  //     act(() => {
  //       result.current.moveForward(500);
  //     });
  //     expect(mockSetTime).toHaveBeenCalledWith(1500);

  //     act(() => {
  //       result.current.moveBackward(300);
  //     });
  //     expect(mockSetTime).toHaveBeenCalledWith(1200);
  //   });

  //   it("checks if movement is possible", () => {
  //     const { result } = renderHook(() => useTimeControl());

  //     expect(result.current.canMoveForward(1500)).toBe(true);
  //     expect(result.current.canMoveForward(2500)).toBe(false);
  //     expect(result.current.canMoveBackward(500)).toBe(true);
  //     expect(result.current.canMoveBackward(1500)).toBe(false);
  //   });
  // });

  // !TODO: Fix this test
  // describe("Jump Controls", () => {
  //   it("jumps to start and end", () => {
  //     const { result } = renderHook(() => useTimeControl());

  //     act(() => {
  //       result.current.jumpToStart();
  //     });
  //     expect(mockSetTime).toHaveBeenCalledWith(0);

  //     act(() => {
  //       result.current.jumpToEnd();
  //     });
  //     expect(mockSetTime).toHaveBeenCalledWith(3000);
  //   });
  // });

  // !TODO: Fix this test
  // describe("State Flags", () => {
  //   it("correctly sets isAtStart and isAtEnd", () => {
  //     const { result, rerender } = renderHook(() => useTimeControl());

  //     // Test start
  //     act(() => {
  //       result.current.setTime(0);
  //     });
  //     rerender(); // Force hook to get latest state
  //     expect(result.current.isAtStart).toBe(true);
  //     expect(result.current.isAtEnd).toBe(false);

  //     // Test end
  //     act(() => {
  //       result.current.setDuration(3000);
  //       result.current.setTime(3000);
  //     });
  //     rerender(); // Force hook to get latest state
  //     expect(result.current.isAtStart).toBe(false);
  //     expect(result.current.isAtEnd).toBe(true);
  //   });
  // });
});
