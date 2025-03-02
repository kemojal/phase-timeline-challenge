import { render, screen } from "@testing-library/react";
import { Playhead } from "../Playhead";



describe("Playhead Component", () => {
    const timelineWidth = 600;


    test("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
        const { rerender } = render(<Playhead time={500} scrollLeft={0} />);
        
        const playhead = screen.getByTestId("playhead");
        expect(playhead).toHaveStyle(`transform: translateX(calc(500px - 50%))`);
    
        rerender(<Playhead time={500} scrollLeft={100} />);
        expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
      });


      test("Playhead maintains its relative position during horizontal scrolling", () => {
        const { rerender } = render(<Playhead time={600} scrollLeft={200} />);
        
        const playhead = screen.getByTestId("playhead");
        expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
    
        rerender(<Playhead time={700} scrollLeft={300} />);
        expect(playhead).toHaveStyle(`transform: translateX(calc(400px - 50%))`);
      });

});
