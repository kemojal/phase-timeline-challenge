import {
    useCallback,
    useState,
    useRef,
    KeyboardEvent,
    FocusEvent,
    ChangeEvent,
    useEffect,
  } from "react";
  
  interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    "data-testid"?: string;
  }
  
  export const NumberInput = ({
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    "data-testid": testId,
  }: NumberInputProps) => {
    const [displayValue, setDisplayValue] = useState(value.toString());
    const previousValue = useRef(value);
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    };
  
    const confirmValue = useCallback(() => {
      if (!/^-?\d*\.?\d*$/.test(displayValue)) {
        setDisplayValue(previousValue.current.toString());
        return;
      }
  
      const numValue = Number(displayValue);
      if (!isNaN(numValue)) {
        const roundedValue = Math.round(numValue);
        const boundedValue = Math.max(min, Math.min(max, roundedValue));
        const finalValue = step ? Math.round(boundedValue / step) * step : boundedValue;
        
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
            inputRef.current.setAttribute('data-selected', 'true');
          }
        }, 0);
      },
      [step, min, max, onChange]
    );
  
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
          inputRef.current.setAttribute('data-selected', 'true');
        }
      }, 0);
    };
  
    const handleStepClick = useCallback(() => {
      setTimeout(() => inputRef.current?.select(), 0);
    }, []);
  
    return (
      <input
        ref={inputRef}
        data-selected="false"
        type="number"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onClick={handleStepClick}
        min={min}
        max={max}
        step={step}
        className="px-1 bg-gray-700 rounded"
        data-testid={testId}
      />
    );
  };
  