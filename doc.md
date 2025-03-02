Steps to Sync the Playhead with Scrolling:
Track the scroll position of Ruler and KeyframeList.
Convert scroll position to time based on a fixed ratio.
Update the time state whenever scrolling occurs.
Ensure Playhead position updates smoothly.



✔️ The Playhead moves correctly when interacting with the Ruler and Keyframe List.
✔️ The Playhead remains in place relative to the timeline during horizontal scrolling.
✔️ The scroll syncing is optimized, reducing unnecessary re-renders.