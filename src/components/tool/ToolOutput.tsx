import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { FieldSpec } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

import { formatSize } from "./format-size";

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

// 文件输出：文件名、体积和下载按钮；object URL 随结果更新或卸载时释放
function FileOutput({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <FieldDescription className="min-w-0 break-all">
        {file.name} · {formatSize(file.size)}
      </FieldDescription>
      <a
        className={buttonVariants({ variant: "outline" })}
        href={url}
        download={file.name}
        data-type={file.type}
        data-size={file.size}
      >
        <DownloadIcon />
        {m.tool_download()}
      </a>
    </div>
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

  if (spec.kind === "file") {
    return (
      <Field data-output={spec.name}>
        <FieldLabel>{title}</FieldLabel>
        {value instanceof File && <FileOutput file={value} />}
      </Field>
    );
  }

  if (spec.kind === "files") throw new Error(`多文件字段 ${spec.name} 只能用于输入`);

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
