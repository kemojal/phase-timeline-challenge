import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NumberInput from "..";

interface SetupProps {
  value: number;
  min: number;
  max: number;
  step: number;
  "data-testid"?: string;
}

const setup = (props: SetupProps) => {
  const onChange = jest.fn();
  render(<NumberInput {...props} onChange={onChange} />);

  // Use getByRole to get input element, which will be properly typed as HTMLInputElement
  const input = screen.getByRole("spinbutton") as HTMLInputElement;
  if (!input)
    throw new Error("NumberInput element not found. Check your testID.");

  return { input, onChange };
};

describe("NumberInput Component", () => {
  test("updates displayed value while typing but delays onChange", () => {
    const { input, onChange } = setup({
      value: 10,
      min: 0,
      max: 100,
      step: 1,
      "data-testid": "test-input",
    });
    fireEvent.change(input, { target: { value: "25" } });
    expect(input.value).toBe("25");
    expect(onChange).not.toHaveBeenCalled();
  });
});
