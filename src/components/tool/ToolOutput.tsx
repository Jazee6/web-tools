import { CheckIcon, CopyIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { FieldSpec } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

// 表格依赖 TanStack Table，只有用到表格输出的 Tool 才加载
const OutputTable = lazy(() => import("./OutputTable"));

export interface OutputLabel {
  label: string;
  columns?: Record<string, string>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <InputGroupButton
      variant="ghost"
      onClick={() => navigator.clipboard.writeText(value).then(() => setCopied(true))}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? m.tool_copied() : m.tool_copy()}
    </InputGroupButton>
  );
}

export function ToolOutput({
  spec,
  value,
  label,
}: {
  spec: FieldSpec;
  value: unknown;
  label?: OutputLabel;
}) {
  const id = `tool-output-${spec.name}`;
  const title = label?.label ?? spec.name;

  if (spec.kind === "table") {
    return (
      <Field data-output={spec.name}>
        <FieldLabel>{title}</FieldLabel>
        <Suspense>
          <OutputTable
            rows={Array.isArray(value) ? value : []}
            columns={spec.columns}
            labels={label?.columns ?? {}}
          />
        </Suspense>
      </Field>
    );
  }

  const text = String(value ?? "");
  const multiline = spec.kind === "code" || spec.kind === "text";
  return (
    <Field data-output={spec.name}>
      <FieldLabel htmlFor={id}>{title}</FieldLabel>
      {multiline ? (
        <InputGroup>
          <InputGroupTextarea
            id={id}
            readOnly
            value={text}
            spellCheck={false}
            variant={spec.kind === "code" ? "code" : "default"}
          />
          <InputGroupAddon align="block-end" className="justify-end">
            <CopyButton value={text} />
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <InputGroup>
          <InputGroupInput id={id} readOnly value={text} spellCheck={false} />
          <InputGroupAddon align="inline-end">
            <CopyButton value={text} />
          </InputGroupAddon>
        </InputGroup>
      )}
    </Field>
  );
}
