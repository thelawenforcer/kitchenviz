interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  suffix,
}: SliderProps) {
  const clamped = Math.min(Math.max(value, min), max);
  return (
    <label className="block text-[11px] text-neutral-400">
      <div className="flex items-center justify-between mb-1">
        <span className="capitalize">{label}</span>
        <span className="tabular-nums text-neutral-300">
          {clamped}
          {suffix ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
