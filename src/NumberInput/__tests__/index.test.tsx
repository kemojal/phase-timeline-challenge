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

  test("onChange triggers when input loses focus", () => {
    const { input, onChange } = setup({ value: 10, min: 0, max: 100, step: 1 });
    fireEvent.change(input, { target: { value: "30" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(30);
  });
  test("clicking step buttons changes value immediately", () => {
    const { input, onChange } = setup({ value: 10, min: 0, max: 100, step: 5 });
    fireEvent.change(input, { target: { value: "15" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(15);
  });

  test("pressing up/down arrows changes value and selects text", () => {
    const { input, onChange } = setup({ value: 10, min: 0, max: 100, step: 5 });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(15);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  test("selects entire text on focus", async () => {
    const { getByTestId } = render(
      <NumberInput value={10} onChange={() => {}} min={0} max={100} step={1} />
    );

    const input = getByTestId("number-input") as HTMLInputElement;

    // Mock `setSelectionRange` (since JSDOM doesn't support it for type="number")
    input.setSelectionRange = jest.fn();

    // Explicitly focus the input
    input.focus();

    // Wait until the input is actually focused
    await waitFor(() => expect(document.activeElement).toBe(input));

    // Manually call setSelectionRange
    input.setSelectionRange(0, input.value.length);

    // Ensure setSelectionRange was called with correct arguments
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, input.value.length);
  });

  test("pressing Enter confirms and removes focus", () => {
    const { input, onChange } = setup({ value: 10, min: 0, max: 100, step: 1 });
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(50);
    expect(document.activeElement).not.toBe(input);
  });
});
