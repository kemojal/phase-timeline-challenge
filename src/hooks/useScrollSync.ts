import { RefObject, useEffect, useRef } from "react";

interface ScrollSyncOptions {
  /** Enable vertical scroll synchronization */
  vertical?: boolean;
  /** Enable horizontal scroll synchronization */
  horizontal?: boolean;
}

/**
 * Custom hook to synchronize scrolling between two elements
 * @param sourceRef Reference to the source element that triggers scroll events
 * @param targetRef Reference to the target element that follows source's scroll position
 * @param options Configuration options for scroll synchronization
 */
export function useScrollSync(
  sourceRef: RefObject<HTMLElement>,
  targetRef: RefObject<HTMLElement>,
  options: ScrollSyncOptions = {}
): void {
  const { vertical = true, horizontal = true } = options;
  const isScrolling = useRef(false);

  useEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;

    if (!source || !target) {
      return;
    }

    let timeoutId: number;

    const handleScroll = () => {
      if (isScrolling.current) return;

      isScrolling.current = true;

      if (vertical) {
        target.scrollTop = source.scrollTop;
      }
      if (horizontal) {
        target.scrollLeft = source.scrollLeft;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        isScrolling.current = false;
      }, 10); // Fixed small delay for better performance
    };

    source.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      source.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sourceRef, targetRef, vertical, horizontal]);
}
