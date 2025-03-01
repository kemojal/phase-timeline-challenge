import {
  ChangeEvent,
  FocusEvent,
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
  "data-testid": testId,
}: InputProps) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const previousValue = useRef(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  // Handle confirmation events (blur and Enter key)
  const confirmValue = useCallback(() => {
    if (!/^-?\d*\.?\d*$/.test(displayValue)) {
      setDisplayValue(previousValue.current.toString());
      return;
    }

    const numValue = Number(displayValue);
    if (!isNaN(numValue)) {
      const roundedValue = Math.round(numValue);
      const boundedValue = Math.max(min, Math.min(max, roundedValue));
      const finalValue = step
        ? Math.round(boundedValue / step) * step
        : boundedValue;

      if (finalValue !== previousValue.current) {
        onChange(finalValue);
      }
      setDisplayValue(finalValue.toString());
      previousValue.current = finalValue;
    } else {
      setDisplayValue(previousValue.current.toString());
    }
  }, [displayValue, min, max, step, onChange]);

  useEffect(() => {
    const boundedValue = Math.max(min, Math.min(max, value));
    setDisplayValue(boundedValue.toString());
    previousValue.current = boundedValue;
  }, [value, min, max]);

  const handleBlur = () => {
    confirmValue();
  };

  const handleStep = useCallback(
    (increment: boolean) => {
      const currentValue = previousValue.current;
      const delta = increment ? step : -step;
      const steppedValue = currentValue + delta;
      const boundedValue = Math.max(min, Math.min(max, steppedValue));

      setDisplayValue(boundedValue.toString());
      onChange(boundedValue);
      previousValue.current = boundedValue;

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.select();
          inputRef.current.setAttribute("data-selected", "true");
        }
      }, 0);
    },
    [step, min, max, onChange]
  );

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        confirmValue();
        inputRef.current?.blur();
        break;
      case "Escape":
        setDisplayValue(value.toString());
        inputRef.current?.blur();
        break;
      case "ArrowUp":
        e.preventDefault();
        handleStep(true);
        break;
      case "ArrowDown":
        e.preventDefault();
        handleStep(false);
        break;
    }
  };

  const handleFocus = (_e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
        inputRef.current.setAttribute("data-selected", "true");
      }
    }, 0);
  };

  const handleStepClick = useCallback(() => {
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  return (
    <input
      className="px-1 bg-gray-700 rounded"
      type="number"
      data-testid={testId}
      min={min}
      max={max}
      step={step}
      value={displayValue}
      onChange={handleOnChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onClick={handleStepClick}
    />
  );
};

export default NumberInput;
