# Phase Timeline Challenge

## Overview

Implement interactive features for a Timeline component. We will provide a basic Timeline component scaffold, and your task is to implement the functionality that meets the user behavior requirements outlined below.

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
- **Segment**: The visual representation of the Timeline's duration in the Keyframe List.

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

![Number Input Field Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/01-input-test.gif?raw=true)

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

https://github.com/user-attachments/assets/9a669854-e0c5-4950-8364-10fe0b40d16b

Behavior

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

Behavior

https://github.com/user-attachments/assets/42190ade-f708-45a1-8168-2be779c66390

- [x] Clicking or dragging on the Ruler updates the Current Time and Playhead position
- [x] Horizontal scrolling of the Ruler is synchronized with the Keyframe List
- [x] Ruler length visually represents the total Duration (`1ms = 1px`)
- [x] Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 4. Track List Behavior

Interface
| Prop | Type | Description |
| -------------- | --------------------------- | ------------------------------ |
| `trackListRef` | `RefObject<HTMLDivElement>` | Ref for scroll synchronization |
| `time` | `number` | Current time value in milliseconds |
| `setTime` | `(time: number) => void` | Callback to update the current time |
| `duration` | `number` | Total duration in milliseconds |

https://github.com/user-attachments/assets/94b5e2c8-ef32-488e-97e4-d53036bbf2f7

Behavior

- [x] Vertical scrolling of the Track List is synchronized with the Keyframe List

### 5. Keyframe List Behavior

Interface
| Prop | Type | Description |
| ----------------- | --------------------------- | ----------------------------------------- |
| `duration` | `number` | Total duration in milliseconds |
| `keyframeListRef` | `RefObject<HTMLDivElement>` | Ref for horizontal scroll synchronization |
| `rulerRef` | `RefObject<HTMLDivElement>` | Ref for horizontal scroll synchronization |
| `trackListRef` | `RefObject<HTMLDivElement>` | Ref for vertical scroll synchronization |

https://github.com/user-attachments/assets/99826161-f821-4e4d-b9a8-b59c16d9894e

Behavior

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

https://github.com/user-attachments/assets/3940cd0d-dd9d-4331-9172-592462ad65d3

Behavior

- [x] Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling
- [x] Playhead maintains its relative position during horizontal scrolling
- [x] Playhead is visible only when within the Timeline's visible area, using the `hidden` attribute when completely out of view

## Implementation Guidelines

- Implement the required behaviors in the appropriate child components of the provided Timeline
- Write comprehensive tests to ensure that the implementation meets the user behavior requirements, including edge cases
- Consider performance implications, such as minimizing unnecessary re-renders
- Pay attention to user experience and interface design
- Write clean, well-documented, and maintainable code
