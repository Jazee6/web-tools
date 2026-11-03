import { ArrowLeftIcon, ArrowRightIcon, RotateCwIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";
import {
  type ArrangedPage,
  expandArrangement,
  formatArrangement,
  parseArrangement,
  rotateClockwise,
} from "@/lib/pdf/arrangement";
import type { ThumbnailRequest, Thumbnails } from "@/lib/pdf/thumbnails";
import type { AnyTool } from "@/lib/tool-contract/define-tool";
import { m } from "@/paraglide/messages";

import { previewInWorker } from "./tool-worker";

// 每批渲染的页数：第一批尽快出现，后面的边渲染边显示
const BATCH = 8;

// 换文件时整个编辑器重建，缩略图和页数从头开始
const keys = new WeakMap<File, number>();
let nextKey = 0;
const keyOf = (file: File) => {
  if (!keys.has(file)) keys.set(file, nextKey++);
  return keys.get(file)!;
};

const arrangementOf = (value: string, total: number) => {
  try {
    return expandArrangement(parseArrangement(value), total);
  } catch {
    // 写错的文本由提交时的校验报出
    return undefined;
  }
};

// 页面排列字段（widget: "pages"）的缩略图编辑器：选了 PDF 后才加载。
// 编辑的就是字段里的字符串（lib/pdf/arrangement.ts），文本框和编辑器始终一致；
// 文本框里暂时写错时保留上一次能读懂的排列
export default function PageEditor(props: {
  tool: AnyTool;
  file: File;
  value: string;
  onChange: (value: string) => void;
}) {
  return <Editor key={keyOf(props.file)} {...props} />;
}

function Editor({
  tool,
  file,
  value,
  onChange,
}: {
  tool: AnyTool;
  file: File;
  value: string;
  onChange: (value: string) => void;
}) {
  const [total, setTotal] = useState<number>();
  const [images, setImages] = useState<Map<number, string>>(new Map());

  // 在 Tool 的 Worker 里按批渲染缩略图；换文件或卸载时中止并释放 object URL
  useEffect(() => {
    const controller = new AbortController();
    const urls: string[] = [];
    void (async () => {
      let start = 1;
      let count = Infinity;
      while (start <= count) {
        const batch = await previewInWorker<Thumbnails>(
          tool,
          { file, start, count: BATCH } satisfies ThumbnailRequest,
          { signal: controller.signal },
        );
        count = batch.total;
        setTotal(batch.total);
        const added = batch.images.flatMap((image, index) => {
          if (!image) return [];
          const url = URL.createObjectURL(image);
          urls.push(url);
          return [[start + index, url] as const];
        });
        setImages((previous) => new Map([...previous, ...added]));
        start += BATCH;
      }
    })().catch(() => {
      // 取消是常态；打不开的 PDF（加密、损坏）提交时会有明确提示，这里只是不显示缩略图
    });
    return () => {
      controller.abort();
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [tool, file]);

  const parsed = useMemo(
    () => (total === undefined ? undefined : arrangementOf(value, total)),
    [value, total],
  );
  const [lastValid, setLastValid] = useState<ArrangedPage[]>();
  if (parsed && parsed !== lastValid) setLastValid(parsed);
  const pages = parsed ?? lastValid;

  if (total === undefined || !pages) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        {m.form_pages_loading()}
      </p>
    );
  }

  const update = (next: ArrangedPage[]) => onChange(formatArrangement(next, total));
  const move = (from: number, to: number) => {
    const next = [...pages];
    next.splice(to, 0, ...next.splice(from, 1));
    update(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" data-page-editor>
        {pages.map(({ page, rotate }, index) => (
          // 同一页可以出现多次，位置才是唯一的
          // oxlint-disable-next-line react/no-array-index-key
          <li key={index} className="flex flex-col items-center gap-2" data-page={page}>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted p-2">
              {images.has(page) ? (
                <img
                  src={images.get(page)}
                  alt=""
                  className="max-h-full max-w-full shadow-sm transition-transform"
                  style={{ transform: `rotate(${rotate}deg)` }}
                />
              ) : (
                <Spinner className="text-muted-foreground" />
              )}
            </div>
            <span className="text-sm tabular-nums">
              {page}
              {rotate > 0 && <span className="text-muted-foreground"> ↻ {rotate}°</span>}
            </span>
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={m.form_page_earlier({ page: String(page) })}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={m.form_page_later({ page: String(page) })}
                disabled={index === pages.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowRightIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={m.form_page_rotate({ page: String(page) })}
                onClick={() =>
                  update(
                    pages.map((item, other) =>
                      other === index ? { page, rotate: rotateClockwise(rotate) } : item,
                    ),
                  )
                }
              >
                <RotateCwIcon />
              </Button>
              {/* 至少留一页：空的排列表示全部页面 */}
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={m.form_page_remove({ page: String(page) })}
                disabled={pages.length === 1}
                onClick={() => update(pages.filter((_, other) => other !== index))}
              >
                <XIcon />
              </Button>
            </ButtonGroup>
          </li>
        ))}
      </ol>
      {value.trim() !== "" && (
        <div>
          <Button variant="outline" size="sm" onClick={() => onChange("")}>
            {m.form_pages_reset()}
          </Button>
        </div>
      )}
    </div>
  );
}
