# Phase Timeline Challenge Submission

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/kemojal/phase-timeline-challenge.git
cd phase-timeline-challenge
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

### Running the Project

To start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Running Tests

To run all tests:

```bash
npm test
# or
yarn test
```

To run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## Tests files and folders

- `src/NumberInput/__tests__/index.test.tsx` - Tests for the Number Input component
- `src/Timeline/__tests__/PlayControls.test.tsx` - Tests for the PlayControls component
- `src/Timeline/__tests__/Ruler.test.tsx` - Tests for the
  Ruler component
- `src/Timeline/__tests__/TrackList.test.tsx` - Tests for the
- Track List component
- `src/Timeline/__tests__/KeyframeList.test.tsx` - Tests for the Keyframe List component
- `src/Timeline/__tests__/Playhead.test.tsx` - Tests for the Playhead component component

### Test Results

|                                                             Number Input                                                             |                                                              Play Controls                                                              |                                                                     Ruler                                                                     |
| :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Number Input](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/01-number-input.png?raw=true) |  ![Play Controls](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/02-playcontrol.png?raw=true)   |            ![Ruler](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/03-ruler.png?raw=true)             |
|   ![Track List](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/04-tracklist.png?raw=true)    | ![Keyframe List](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/05-1-keyframelist.png?raw=true) | ![Keyframe Segment](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/05-1-keyframesegment.png?raw=true) |
|     ![Playhead](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/test-results/06-playhead.png?raw=true)     |                                                                                                                                         |                                                                                                                                               |

## User Behavior Requirements

### 1. Number Input Field

#### Interface

| Prop          | Type                             | Required | Description                                                        |
| :------------ | :------------------------------- | :------: | :----------------------------------------------------------------- |
| `value`       | `number`                         | &#10004; | The current value of the input field                               |
| `onChange`    | `(value: number) => void`        | &#10004; | Callback function called when the value changes                    |
| `min`         | `number`                         | &#10004; | Minimum allowed value                                              |
| `max`         | `number`                         | &#10004; | Maximum allowed value                                              |
| `step`        | `number`                         | &#10004; | Step value for increment/decrement operations                      |
| `onKeyDown`   | `(event: KeyboardEvent) => void` | &#8211;  | Optional callback for handling keyboard events                     |
| `data-testid` | `string`                         | &#8211;  | Optional test ID for testing purposes (defaults to "number-input") |

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

#### Interface

| Prop          | Type                         | Required | Description                         |
| :------------ | :--------------------------- | :------: | :---------------------------------- |
| `time`        | `number`                     | &#10004; | Current time value in milliseconds  |
| `setTime`     | `(time: number) => void`     | &#10004; | Callback to update the current time |
| `duration`    | `number`                     | &#10004; | Total duration in milliseconds      |
| `setDuration` | `(duration: number) => void` | &#10004; | Callback to update the duration     |

![Play Controls Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/02-play-controls-test.gif?raw=true)

Behavior Test Case

- [x] Current Time is always between `0ms` and the Duration
- [x] Current Time adjusts if it exceeds the newly set Duration
- [x] Duration is always between `100ms` and `6000ms`
- [x] Current Time and Duration are always multiples of `10ms`
- [x] Current Time and Duration are always positive integers
- [x] Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 3. Ruler Behavior

#### Interface

| Prop       | Type                        | Required | Description                         |
| :--------- | :-------------------------- | :------: | :---------------------------------- |
| `time`     | `number`                    | &#10004; | Current time value in milliseconds  |
| `setTime`  | `(time: number) => void`    | &#10004; | Callback to update the current time |
| `duration` | `number`                    | &#10004; | Total duration in milliseconds      |
| `rulerRef` | `RefObject<HTMLDivElement>` | &#10004; | Ref for scroll synchronization      |

![Ruler Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/03-ruler-test.gif?raw=true)

- [x] Clicking or dragging on the Ruler updates the Current Time and Playhead position
- [x] Horizontal scrolling of the Ruler is synchronized with the Keyframe List
- [x] Ruler length visually represents the total Duration (`1ms = 1px`)
- [x] Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 4. Track List Behavior

#### Interface

| Prop              | Type                        | Required | Description                                       |
| :---------------- | :-------------------------- | :------: | :------------------------------------------------ |
| `trackListRef`    | `RefObject<HTMLDivElement>` | &#10004; | Ref for scroll synchronization                    |
| `keyframeListRef` | `RefObject<HTMLDivElement>` | &#10004; | Ref for scroll synchronization with Keyframe List |

![Track List Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/04-track-list-test.gif?raw=true)

Behavior test

- [x] Vertical scrolling of the Track List is synchronized with the Keyframe List

### 5. Keyframe List Behavior

#### Interface

| Prop              | Type                        | Required | Description                               |
| :---------------- | :-------------------------- | :------: | :---------------------------------------- |
| `duration`        | `number`                    | &#10004; | Total duration in milliseconds            |
| `keyframeListRef` | `RefObject<HTMLDivElement>` | &#10004; | Ref for horizontal scroll synchronization |
| `rulerRef`        | `RefObject<HTMLDivElement>` | &#10004; | Ref for horizontal scroll synchronization |
| `trackListRef`    | `RefObject<HTMLDivElement>` | &#10004; | Ref for vertical scroll synchronization   |

![Keyframe List Behavior Test](https://github.com/kemojal/phase-timeline-challenge/blob/main/test-assets/gifs/05-keyframe-list-test.gif?raw=true)

Behavior test

- [x] Vertical scrolling is synchronized with the Track List
- [x] Horizontal scrolling is synchronized with the Ruler
- [x] Segment length visually represents the total Duration (`1ms = 1px`)
- [x] Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 6. Playhead Behavior

#### Interface

| Prop         | Type     | Required | Description                        |
| :----------- | :------- | :------: | :--------------------------------- |
| `time`       | `number` | &#10004; | Current time value in milliseconds |
| `scrollLeft` | `number` | &#10004; | Current horizontal scroll position |
| `duration`   | `number` | &#10004; | Total duration in milliseconds     |

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
