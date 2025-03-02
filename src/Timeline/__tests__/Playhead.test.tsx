import { render, screen } from "@testing-library/react";
import { Playhead } from "../Playhead";



describe("Playhead Behavior", () => {
    const timelineWidth = 600;


    test("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
        const { rerender } = render(<Playhead time={500} scrollLeft={0} />);
        
        const playhead = screen.getByTestId("playhead");
        expect(playhead).toHaveStyle(`transform: translateX(calc(500px - 50%))`);
    
        rerender(<Playhead time={500} scrollLeft={100} />);
        expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
      });

});
