import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { m } from "@/paraglide/messages";

import { formatSize } from "./format-size";

// 多文件字段（v.array(v.file())）：可以分几次添加文件，列表顺序即输入顺序，可上移、下移、移除。
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
  onChange,
  onBlur,
}: {
  id: string;
  name: string;
  accept: string[];
  files: File[];
  invalid: boolean;
  onChange: (files: File[]) => void;
  onBlur: () => void;
}) {
  const move = (from: number, to: number) => {
    const next = [...files];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange(next);
  };

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
              <ItemContent className="min-w-0">
                <ItemTitle className="break-all">{file.name}</ItemTitle>
                <ItemDescription>{formatSize(file.size)}</ItemDescription>
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
    </div>
  );
}
