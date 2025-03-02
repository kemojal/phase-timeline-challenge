# Phase Timeline Challenge Submission

<!-- ## Overview -->

<!-- Implement interactive features for a Timeline component. We will provide a basic Timeline component scaffold, and your task is to implement the functionality that meets the user behavior requirements outlined below.

![component-overview](./readme-assets/component-overview.jpg)

## Glossary

- **Timeline**: The main component that visually represents the duration of a sequence of events or changes over time.
- **Playhead**: The visual indicator that shows the current time position on the Timeline.
- **Current Time**: The specific time point indicated by the Playhead's position.
- **Duration**: The total length of time represented by the Timeline.
- **Ruler**: The component showing time measurements and increments along the Timeline.
- **Track**: A horizontal lane on the Timeline that can contain multiple Keyframes, often used to group related events or changes.
- **Track List**: The component that displays and manages multiple Tracks.
- **Keyframe**: A marked point on the Timeline representing a significant event, change, or state.
- **Keyframe List**: The component that shows the Keyframes across all Tracks, synchronized with the Ruler.
- **Segment**: The visual representation of the Timeline's duration in the Keyframe List. -->

## Tests files and folders


- `src/Timeline/__tests__/Playhead.test.tsx` - Tests for the Playhead component
- `src/Timeline/__tests__/KeyframeList.test.tsx` - Tests for the Keyframe List component
- `src/Timeline/__tests__/TrackList.test.tsx` - Tests for the Track List component
- `src/Timeline/__tests__/Timeline.test.tsx` - Tests for the Timeline component
- `src/Timeline/__tests__/Ruler.test.tsx` - Tests for the Ruler component
- `src/Timeline/__tests__/Keyframe.test.tsx` - Tests for the Keyframe component
- `src/Timeline/__tests__/Track.test.tsx` - Tests for the Track component
- `src/Timeline/__tests__/Segment.test.tsx` - Tests for the Segment component
- `src/Timeline/__tests__/TimelineContext.test.tsx` - Tests for the Timeline Context component
- `src/Timeline/__tests__/TimelineProvider.test.tsx` - Tests for 
  

## User Behavior Requirements

### 1. Number Input Field

#### Interface

| Prop          | Type                             | Description                                                        |
| ------------- | -------------------------------- | ------------------------------------------------------------------ |
| `value`       | `number`                         | The current value of the input field                               |
| `onChange`    | `(value: number) => void`        | Callback function called when the value changes                    |
| `min`         | `number`                         | Minimum allowed value                                              |
| `max`         | `number`                         | Maximum allowed value                                              |
| `step`        | `number`                         | Step value for increment/decrement operations                      |
| `onKeyDown`   | `(event: KeyboardEvent) => void` | Optional callback for handling keyboard events                     |
| `data-testid` | `string`                         | Optional test ID for testing purposes (defaults to "number-input") |

#### Behavior

![Number Input Field Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/01-input-test.gif?raw=true)

- [x] The input field displays the current value
- [x] The displayed value updates immediately while typing, but `onChange` is not triggered until input is confirmed
- [x] Clicking outside the input field removes focus and changes the value
- [x] Clicking on the native step buttons immediately changes the value
- [x] Pressing up arrow or down arrow keys immediately changes the value
- [x] Entire text is selected when the input field gains focus
- [x] Entire text is selected after using the native step buttons
- [x] Entire text is selected after using the up arrow or down arrow keys
- [x] Pressing Enter confirms the new value and removes focus
- [x] Pressing Escape reverts to the original value and removes focus
- [x] Leading zeros are automatically removed
- [x] Negative values are automatically adjusted to the minimum allowed value
- [x] Decimal values are automatically rounded to the nearest integer
- [x] Invalid inputs (non-numeric) revert to the previous valid value

### 2. Play Controls Behavior

Interface

| Prop          | Type                         | Description                         |
| ------------- | ---------------------------- | ----------------------------------- |
| `time`        | `number`                     | Current time value in milliseconds  |
| `setTime`     | `(time: number) => void`     | Callback to update the current time |
| `duration`    | `number`                     | Total duration in milliseconds      |
| `setDuration` | `(duration: number) => void` | Callback to update the duration     |

![Play Controls Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/02-play-controls-test.gif?raw=true)

Behavior Test Case

- [x] Current Time is always between `0ms` and the Duration
- [x] Current Time adjusts if it exceeds the newly set Duration
- [x] Duration is always between `100ms` and `6000ms`
- [x] Current Time and Duration are always multiples of `10ms`
- [x] Current Time and Duration are always positive integers
- [x] Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 3. Ruler Behavior

Interface
| Prop | Type | Description |
| ---------- | --------------------------- | ----------------------------------- |
| `time` | `number` | Current time value in milliseconds |
| `setTime` | `(time: number) => void` | Callback to update the current time |
| `duration` | `number` | Total duration in milliseconds |
| `rulerRef` | `RefObject<HTMLDivElement>` | Ref for scroll synchronization |

Behavior test

![Ruler Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/03-ruler-test.gif?raw=true)

- [x] Clicking or dragging on the Ruler updates the Current Time and Playhead position
- [x] Horizontal scrolling of the Ruler is synchronized with the Keyframe List
- [x] Ruler length visually represents the total Duration (`1ms = 1px`)
- [x] Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 4. Track List Behavior

Interface
| Prop | Type | Description |
| -------------- | --------------------------- | ------------------------------ |
| `trackListRef` | `RefObject<HTMLDivElement>` | Ref for scroll synchronization |
| `keyframeListRef` | `RefObject<HTMLDivElement>` | Ref for scroll synchronization with Keyframe List |


![Track List Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/04-track-list-test.gif?raw=true)


Behavior test

- [x] Vertical scrolling of the Track List is synchronized with the Keyframe List

### 5. Keyframe List Behavior

Interface
| Prop | Type | Description |
| ----------------- | --------------------------- | ----------------------------------------- |
| `duration` | `number` | Total duration in milliseconds |
| `keyframeListRef` | `RefObject<HTMLDivElement>` | Ref for horizontal scroll synchronization |
| `rulerRef` | `RefObject<HTMLDivElement>` | Ref for horizontal scroll synchronization |
| `trackListRef` | `RefObject<HTMLDivElement>` | Ref for vertical scroll synchronization |

![Keyframe List Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/05-keyframe-list-test.gif?raw=true)

Behavior test

- [x] Vertical scrolling is synchronized with the Track List
- [x] Horizontal scrolling is synchronized with the Ruler
- [x] Segment length visually represents the total Duration (`1ms = 1px`)
- [x] Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 6. Playhead Behavior

Interface
| Prop | Type | Description |
| ------------ | -------- | ---------------------------------- |
| `time` | `number` | Current time value in milliseconds |
| `scrollLeft` | `number` | Current horizontal scroll position |
| `duration` | `number` | Total duration in milliseconds |

![Playhead Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/06-playhead-test.gif?raw=true)



Behavior test

- [x] Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling
- [x] Playhead maintains its relative position during horizontal scrolling
- [x] Playhead is visible only when within the Timeline's visible area, using the `hidden` attribute when completely out of view

## Implementation Guidelines

- Implement the required behaviors in the appropriate child components of the provided Timeline
- Write comprehensive tests to ensure that the implementation meets the user behavior requirements, including edge cases
- Consider performance implications, such as minimizing unnecessary re-renders
- Pay attention to user experience and interface design
- Write clean, well-documented, and maintainable code
