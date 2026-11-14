import { CodeIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast, Toaster } from "@/components/ui/toast";
import { m } from "@/paraglide/messages";

// 富文本输出（字段 widget: "html"）：在 iframe 里按手机宽度预览，复制成富文本（粘贴进公众号等编辑器）或 HTML 源码。
// iframe 隔离站点样式（Tailwind preflight 会去掉列表符号、改写图片），sandbox 不允许脚本；
// 只开 allow-same-origin，用来按内容高度撑开 iframe
const frameDocument = (html: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#fff}body{padding:20px 16px}</style></head><body>${html}</body></html>`;

const copy = async (html: string, rich: boolean) => {
  try {
    if (rich) {
      const text = new DOMParser().parseFromString(html, "text/html").body.innerText;
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      toast.add({ title: m.tool_copied_rich(), type: "success" });
    } else {
      await navigator.clipboard.writeText(html);
      toast.add({ title: m.tool_copied(), type: "success" });
    }
  } catch {
    toast.add({ title: m.tool_copy_failed(), type: "error" });
  }
};

export default function HtmlOutput({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);

  // 内容和图片加载后都按文档高度撑开，预览区不出现第二条滚动条
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    let observer: ResizeObserver | undefined;
    const fit = () => {
      const body = element.contentDocument?.body;
      if (!body) return;
      element.style.height = `${element.contentDocument!.documentElement.scrollHeight}px`;
      observer?.disconnect();
      observer = new ResizeObserver(() => {
        element.style.height = `${element.contentDocument!.documentElement.scrollHeight}px`;
      });
      observer.observe(body);
    };
    element.addEventListener("load", fit);
    fit();
    return () => {
      element.removeEventListener("load", fit);
      observer?.disconnect();
    };
  }, []);

  return (
    <Field data-output={name}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void copy(value, false)}>
            <CodeIcon />
            {m.tool_copy_html()}
          </Button>
          <Button size="sm" onClick={() => void copy(value, true)}>
            <CopyIcon />
            {m.tool_copy_rich()}
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border">
        <iframe
          ref={frame}
          title={label}
          sandbox="allow-same-origin"
          srcDoc={frameDocument(value)}
          className="block min-h-64 w-full"
        />
      </div>
      <Toaster />
    </Field>
  );
}
