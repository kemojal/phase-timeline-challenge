import { RefObject, useEffect, useRef } from 'react';

interface ScrollSyncOptions {
  /** Enable vertical scroll synchronization */
  vertical?: boolean;
  /** Enable horizontal scroll synchronization */
  horizontal?: boolean;
  /** Debounce time in milliseconds */
  debounceTime?: number;
}

interface ScrollPosition {
  scrollTop: number;
  scrollLeft: number;
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
  const {
    vertical = true,
    horizontal = true,
    debounceTime = 0
  } = options;

  // Use a ref to track if we're currently handling a scroll event
  // This prevents infinite scroll loops between elements
  const isScrolling = useRef(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;

    if (!source || !target) {
      return;
    }

    const handleScroll = (event: Event) => {
      // Prevent infinite scroll loop
      if (isScrolling.current) {
        return;
      }

      const syncScroll = () => {
        if (!source || !target) return;

        isScrolling.current = true;

        // Only sync the enabled scroll directions
        if (vertical) {
          target.scrollTop = source.scrollTop;
        }
        if (horizontal) {
          target.scrollLeft = source.scrollLeft;
        }

        // Reset the scrolling flag after a small delay
        // This ensures smooth scrolling while preventing potential loops
        setTimeout(() => {
          isScrolling.current = false;
        }, 50);
      };

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the scroll sync if debounceTime is set
      if (debounceTime > 0) {
        timeoutRef.current = setTimeout(syncScroll, debounceTime);
      } else {
        syncScroll();
      }
    };

    // Add scroll event listener to source element
    source.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      source.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sourceRef, targetRef, vertical, horizontal, debounceTime]);
}

// Example usage:
/*
function MyComponent() {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useScrollSync(sourceRef, targetRef, {
    vertical: true,
    horizontal: true,
    debounceTime: 10
  });

  return (
    <>
      <div ref={sourceRef}>Source content</div>
      <div ref={targetRef}>Target content</div>
    </>
  );
}
*/
