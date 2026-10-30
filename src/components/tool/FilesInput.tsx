import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";
import { lazy, Suspense } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { m } from "@/paraglide/messages";

import { formatChange, formatSize } from "./format-size";

const FilePreview = lazy(() => import("./FilePreview"));

// 提交前的体积预估（Tool 契约的 estimate）：每个文件的预估输出字节数，无法预估为 null
export type Estimates = Map<File, number | null>;

// 多文件字段（v.array(v.file())）：可以分几次添加文件，列表顺序即输入顺序，可上移、下移、移除；
// 图片 / 视频带缩略图，点击放大；Tool 声明了 estimate 时显示预估体积。
// 只有用到多文件字段的 Tool 才加载。
const keys = new WeakMap<File, number>();
let nextKey = 0;
const keyOf = (file: File) => {
  if (!keys.has(file)) keys.set(file, nextKey++);
  return keys.get(file)!;
};

export default function FilesInput({
  id,
  name,
  accept,
  files,
  invalid,
  estimates,
  estimating = false,
  onChange,
  onBlur,
}: {
  id: string;
  name: string;
  accept: string[];
  files: File[];
  invalid: boolean;
  estimates?: Estimates;
  estimating?: boolean;
  onChange: (files: File[]) => void;
  onBlur: () => void;
}) {
  const move = (from: number, to: number) => {
    const next = [...files];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange(next);
  };

  // 每个文件都有预估时才给合计，否则合计会偏小
  const sizes = files.map((file) => estimates?.get(file));
  const total =
    files.length > 1 && !estimating && sizes.every((size) => typeof size === "number")
      ? {
          before: files.reduce((sum, file) => sum + file.size, 0),
          after: (sizes as number[]).reduce((sum, size) => sum + size, 0),
        }
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      <Input
        id={id}
        name={name}
        type="file"
        multiple
        accept={accept.join(",")}
        aria-invalid={invalid}
        onBlur={onBlur}
        onChange={(event) => {
          const added = Array.from(event.target.files ?? []);
          // 清空选择，同一个文件可以再次添加
          event.target.value = "";
          if (added.length > 0) onChange([...files, ...added]);
        }}
      />
      {files.length > 0 && (
        <ol className="flex flex-col gap-2">
          {files.map((file, index) => (
            <Item key={keyOf(file)} render={<li />} variant="outline" size="sm">
              <ItemMedia>
                <Suspense>
                  <FilePreview file={file} size="sm" />
                </Suspense>
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="break-all">{file.name}</ItemTitle>
                <ItemDescription>
                  {formatSize(file.size)}
                  {estimates && (
                    <Estimate estimating={estimating} size={sizes[index]} file={file} />
                  )}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ButtonGroup>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={m.form_move_up()}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUpIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={m.form_move_down()}
                    disabled={index === files.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDownIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={m.form_remove()}
                    onClick={() => onChange(files.filter((_, other) => other !== index))}
                  >
                    <XIcon />
                  </Button>
                </ButtonGroup>
              </ItemActions>
            </Item>
          ))}
        </ol>
      )}
      {total && (
        <FieldDescription data-estimate-total>
          {m.tool_estimate_total({
            before: formatSize(total.before),
            after: formatSize(total.after),
            change: formatChange(total.before, total.after),
          })}
        </FieldDescription>
      )}
    </div>
  );
}

function Estimate({
  estimating,
  size,
  file,
}: {
  estimating: boolean;
  size: number | null | undefined;
  file: File;
}) {
  if (estimating) return <Spinner className="ml-2 inline size-3.5 align-text-bottom" />;
  if (typeof size !== "number") return null;
  return (
    <span className="ml-2" data-estimate={size}>
      {m.tool_estimate({ size: formatSize(size), change: formatChange(file.size, size) })}
    </span>
  );
}
