type InputProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  return (
    <input
      className="px-1 bg-gray-700 rounded"
      type="number"
      data-testid={testId}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
  );
};

export default NumberInput;
