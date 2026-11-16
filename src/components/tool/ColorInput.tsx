import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const hex = /^#[0-9a-f]{6}$/i;

// 颜色字段（widget: "color"）：左边是系统拾色器，右边可以直接输入 #RRGGBB
export default function ColorInput({
  id,
  name,
  label,
  value,
  invalid,
  onBlur,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  invalid: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <input
          type="color"
          aria-label={label}
          // 拾色器只接受小写的 #rrggbb；输入框里的值无效时保留上一次能显示的颜色
          value={hex.test(value) ? value.toLowerCase() : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="size-6 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-border [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-border [&::-webkit-color-swatch-wrapper]:p-0"
        />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        name={name}
        type="text"
        value={value}
        maxLength={7}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={invalid}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
    </InputGroup>
  );
}
