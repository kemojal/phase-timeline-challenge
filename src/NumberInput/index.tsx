import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type InputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  "data-testid"?: string;
};

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step,
  "data-testid": testId = "number-input",
}: InputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());
  const [internalValue, setInternalValue] = useState<number>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when prop value changes
  useEffect(() => {
    setInternalValue(value);
    setDisplayValue(value.toString());
  }, [value]);

  const validateAndFormatValue = (value: string): number => {
    // Handle empty string
    if (value === "") return internalValue;

    // Remove leading zeros
    const cleanValue = value.replace(/^0+(?=\d)/, "");

    // Parse and validate number
    let numValue = parseFloat(cleanValue);

    // Handle non-numeric input - return the previous valid value
    if (isNaN(numValue)) return internalValue;

    // Round decimal values
    numValue = Math.round(numValue);

    // Handle negative values
    if (numValue < min) return min;

    // Handle max boundary
    if (numValue > max) return max;

    // Ensure step compliance
    return Math.round(numValue / step) * step;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
  };

  const confirmValue = useCallback(() => {
    const validatedValue = validateAndFormatValue(displayValue);
    setInternalValue(validatedValue);
    setDisplayValue(validatedValue.toString());
    if (validatedValue !== value) {
      onChange(validatedValue);
    }
  }, [displayValue, value, onChange, min, max, step, internalValue]);

  const handleBlur = () => {
    confirmValue();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        confirmValue();
        inputRef.current?.blur();
        break;
      case "Escape":
        setDisplayValue(value.toString());
        setInternalValue(value);
        inputRef.current?.blur();
        break;
      case "ArrowUp":
        e.preventDefault();
        const incrementedValue = Math.min(internalValue + step, max);
        setInternalValue(incrementedValue);
        setDisplayValue(incrementedValue.toString());
        onChange(incrementedValue);
        selectText();
        break;
      case "ArrowDown":
        e.preventDefault();
        const decrementedValue = Math.max(internalValue - step, min);
        setInternalValue(decrementedValue);
        setDisplayValue(decrementedValue.toString());
        onChange(decrementedValue);
        selectText();
        break;
    }
  };

  const selectText = useCallback(() => {
    if (inputRef.current) {
      // Do it immediately and also in a requestAnimationFrame for cross-browser reliability
      inputRef.current.select();
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.select();
        }
      });
    }
  }, []);

  const handleFocus = () => {
    selectText();
  };

  const handleStepperClick = () => {
    selectText();
  };

  return (
    <input
      ref={inputRef}
      className="px-1 bg-gray-700 rounded"
      type="number"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onClick={handleStepperClick}
      min={min}
      max={max}
      step={step}
      data-testid={testId}
    />
  );
};

export default NumberInput;
