import { renderHook } from "@testing-library/react";
import { useScrollSync } from "../useScrollSync";

describe("useScrollSync", () => {
  let sourceElement: HTMLDivElement;
  let targetElement: HTMLDivElement;
  let sourceScrollTop = 0;
  let sourceScrollLeft = 0;
  let targetScrollTop = 0;
  let targetScrollLeft = 0;

  beforeEach(() => {
    sourceElement = document.createElement("div");
    targetElement = document.createElement("div");
    sourceScrollTop = 0;
    sourceScrollLeft = 0;
    targetScrollTop = 0;
    targetScrollLeft = 0;
    
    // Mock scroll properties with actual value tracking
    Object.defineProperty(sourceElement, "scrollTop", {
      get: () => sourceScrollTop,
      set: (val) => { sourceScrollTop = val; },
      configurable: true
    });
    Object.defineProperty(sourceElement, "scrollLeft", {
      get: () => sourceScrollLeft,
      set: (val) => { sourceScrollLeft = val; },
      configurable: true
    });
    Object.defineProperty(targetElement, "scrollTop", {
      get: () => targetScrollTop,
      set: (val) => { targetScrollTop = val; },
      configurable: true
    });
    Object.defineProperty(targetElement, "scrollLeft", {
      get: () => targetScrollLeft,
      set: (val) => { targetScrollLeft = val; },
      configurable: true
    });
  });

  it("should sync vertical scroll by default", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: targetElement };

    renderHook(() => useScrollSync(sourceRef, targetRef));

    // Set source scroll values
    sourceScrollTop = 100;
    sourceElement.dispatchEvent(new Event("scroll"));

    expect(targetScrollTop).toBe(100);
  });

  it("should sync horizontal scroll by default", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: targetElement };

    renderHook(() => useScrollSync(sourceRef, targetRef));

    // Set source scroll values
    sourceScrollLeft = 100;
    sourceElement.dispatchEvent(new Event("scroll"));

    expect(targetScrollLeft).toBe(100);
  });

  it("should only sync vertical scroll when horizontal is disabled", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: targetElement };

    renderHook(() => 
      useScrollSync(sourceRef, targetRef, { horizontal: false })
    );

    // Set source scroll values
    sourceScrollTop = 100;
    sourceScrollLeft = 100;
    sourceElement.dispatchEvent(new Event("scroll"));

    expect(targetScrollTop).toBe(100); // Vertical should sync
    expect(targetScrollLeft).toBe(0);  // Horizontal should not sync
  });

  it("should only sync horizontal scroll when vertical is disabled", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: targetElement };

    renderHook(() => 
      useScrollSync(sourceRef, targetRef, { vertical: false })
    );

    // Set source scroll values
    sourceScrollTop = 100;
    sourceScrollLeft = 100;
    sourceElement.dispatchEvent(new Event("scroll"));

    expect(targetScrollLeft).toBe(100); // Horizontal should sync
    expect(targetScrollTop).toBe(0);    // Vertical should not sync
  });

  it("should not sync if source ref is null", () => {
    const sourceRef = { current: null };
    const targetRef = { current: targetElement };

    renderHook(() => useScrollSync(sourceRef, targetRef));
    
    expect(() => {
      sourceScrollTop = 100;
      sourceElement.dispatchEvent(new Event("scroll"));
    }).not.toThrow();
  });

  it("should not sync if target ref is null", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: null };

    renderHook(() => useScrollSync(sourceRef, targetRef));
    
    expect(() => {
      sourceScrollTop = 100;
      sourceElement.dispatchEvent(new Event("scroll"));
    }).not.toThrow();
  });

  it("should clean up event listeners on unmount", () => {
    const sourceRef = { current: sourceElement };
    const targetRef = { current: targetElement };
    const removeEventListenerSpy = jest.spyOn(sourceElement, "removeEventListener");

    const { unmount } = renderHook(() => useScrollSync(sourceRef, targetRef));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});