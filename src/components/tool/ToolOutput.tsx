import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useObjectUrl } from "@/hooks/use-object-url";
import type { FieldSpec } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

import { formatChange, formatSize } from "./format-size";

// 表格依赖 TanStack Table，只有用到表格输出的 Tool 才加载
const OutputTable = lazy(() => import("./OutputTable"));
const FilePreview = lazy(() => import("./FilePreview"));

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

const downloadProps = (file: File, url: string | undefined) => ({
  href: url,
  download: file.name,
  "data-type": file.type,
  "data-size": file.size,
});

// 文件输出：预览（图片 / 视频）、文件名、体积和下载按钮；object URL 随结果更新或卸载时释放
function FileOutput({ file }: { file: File }) {
  const url = useObjectUrl(file);
  return (
    <div className="flex flex-col gap-3">
      <Suspense>
        <FilePreview file={file} size="lg" />
      </Suspense>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldDescription className="min-w-0 break-all">
          {file.name} · {formatSize(file.size)}
        </FieldDescription>
        <a className={buttonVariants({ variant: "outline" })} {...downloadProps(file, url)}>
          <DownloadIcon />
          {m.tool_download()}
        </a>
      </div>
    </div>
  );
}

function FileItem({ file, source }: { file: File; source?: File }) {
  const url = useObjectUrl(file);
  return (
    <Item render={<li />} variant="outline" size="sm">
      <ItemMedia>
        <Suspense>
          <FilePreview file={file} size="sm" />
        </Suspense>
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="break-all">{file.name}</ItemTitle>
        <ItemDescription>
          {source
            ? `${formatSize(source.size)} → ${formatSize(file.size)} (${formatChange(source.size, file.size)})`
            : formatSize(file.size)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <a
          className={buttonVariants({ variant: "outline", size: "sm" })}
          {...downloadProps(file, url)}
        >
          <DownloadIcon />
          {m.tool_download()}
        </a>
      </ItemActions>
    </Item>
  );
}

// 多个文件的 ZIP 里同名文件加序号，避免互相覆盖
const uniqueNames = (files: File[]) => {
  const used = new Set<string>();
  return files.map(({ name }) => {
    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const extension = dot > 0 ? name.slice(dot) : "";
    let candidate = name;
    for (let count = 2; used.has(candidate); count++) candidate = `${stem} (${count})${extension}`;
    used.add(candidate);
    return candidate;
  });
};

// 多文件输出：逐个下载，多于一个时可以打包 ZIP（fflate 只在点击时加载；输出已是压缩格式，用 STORE 不再压缩）
function FilesOutput({
  files,
  sources,
  zipName,
}: {
  files: File[];
  sources?: File[];
  zipName: string;
}) {
  const [zipping, setZipping] = useState(false);
  const download = async () => {
    setZipping(true);
    try {
      const { zipSync } = await import("fflate");
      const names = uniqueNames(files);
      const entries = await Promise.all(
        files.map(async (file) => new Uint8Array(await file.arrayBuffer())),
      );
      const zip = zipSync(Object.fromEntries(entries.map((bytes, i) => [names[i], bytes])), {
        level: 0,
      });
      const url = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = zipName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } finally {
      setZipping(false);
    }
  };
  const before = sources?.reduce((sum, file) => sum + file.size, 0);
  const after = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-2">
        {files.map((file, index) => (
          <FileItem key={index} file={file} source={sources?.[index]} />
        ))}
      </ol>
      {files.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FieldDescription>
            {before !== undefined
              ? `${formatSize(before)} → ${formatSize(after)} (${formatChange(before, after)})`
              : formatSize(after)}
          </FieldDescription>
          <Button variant="outline" disabled={zipping} onClick={() => void download()}>
            {zipping ? <Spinner /> : <DownloadIcon />}
            {m.tool_download_all()}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ToolOutput({
  spec,
  value,
  label,
  sources,
  toolId,
}: {
  spec: FieldSpec;
  value: unknown;
  label?: OutputLabel;
  // 与多文件输出一一对应的输入文件，用来对照体积
  sources?: File[];
  toolId: string;
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

  if (spec.kind === "files") {
    return (
      <Field data-output={spec.name}>
        <FieldLabel>{title}</FieldLabel>
        {Array.isArray(value) && (
          <FilesOutput files={value as File[]} sources={sources} zipName={`${toolId}.zip`} />
        )}
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
