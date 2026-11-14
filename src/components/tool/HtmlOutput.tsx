import { CodeIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

// 富文本输出（字段 widget: "html"）：在 iframe 里预览（默认按手机宽度，preview: "wide" 铺满宽度），
// 复制成富文本（粘贴进公众号等编辑器）或 HTML 源码；source: true 时另有一个标签页显示源码。
// iframe 隔离站点样式（Tailwind preflight 会去掉列表符号、改写图片），sandbox 不允许脚本；
// 只开 allow-same-origin，用来按内容高度撑开 iframe。以 <!doctype 开头的完整文档自带 head 和样式，直接预览
const isDocument = (html: string) => /^\s*<!doctype\s/i.test(html);

const frameDocument = (html: string) =>
  isDocument(html)
    ? html
    : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#fff}body{padding:20px 16px}</style></head><body>${html}</body></html>`;

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
  wide = false,
  source = false,
}: {
  name: string;
  label: string;
  value: string;
  wide?: boolean;
  source?: boolean;
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

  const preview = (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden border",
        wide ? "rounded-lg" : "max-w-sm rounded-2xl",
      )}
    >
      <iframe
        ref={frame}
        title={label}
        sandbox="allow-same-origin"
        srcDoc={frameDocument(value)}
        className="block min-h-64 w-full"
      />
    </div>
  );

  const actions = (
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
  );

  // source：预览和 HTML 源码分两个标签页；两个面板都保持挂载，iframe 的高度监听不会断
  if (source) {
    return (
      <Field data-output={name}>
        <FieldLabel>{label}</FieldLabel>
        <Tabs defaultValue="preview">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="preview">{m.tool_view_preview()}</TabsTrigger>
              <TabsTrigger value="source">{m.tool_view_source()}</TabsTrigger>
            </TabsList>
            {actions}
          </div>
          <TabsContent value="preview" keepMounted>
            {preview}
          </TabsContent>
          <TabsContent value="source" keepMounted>
            <Textarea
              readOnly
              value={value}
              spellCheck={false}
              variant="editor"
              aria-label={label}
            />
          </TabsContent>
        </Tabs>
        <Toaster />
      </Field>
    );
  }

  return (
    <Field data-output={name}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        {actions}
      </div>
      {preview}
      <Toaster />
    </Field>
  );
}
