import { ImageIcon, Maximize2Icon, PlayIcon, VideoIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { useObjectUrl } from "@/hooks/use-object-url";
import { m } from "@/paraglide/messages";

const MediaViewer = lazy(() => import("./MediaViewer"));

export type MediaKind = "image" | "video";

// 按 MIME 类型判断能否预览；浏览器认不出类型的文件（如 Firefox 里的 .mkv）没有预览
export const mediaKindOf = (file: File): MediaKind | undefined =>
  file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : undefined;

// 文件预览：sm 是列表里的缩略图，点击放大；lg 是独立的预览区，图片点击放大，视频内联播放并带放大按钮。
// 浏览器解码失败（如 Chrome 里的 HEIC）时 lg 不显示，sm 退回图标占位。放大查看只在点击后才加载
export default function FilePreview({ file, size }: { file: File; size: "sm" | "lg" }) {
  const kind = mediaKindOf(file);
  const url = useObjectUrl(file);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lastFile, setLastFile] = useState(file);
  if (lastFile !== file) {
    setLastFile(file);
    setFailed(false);
  }
  if (!kind) return null;

  const label = m.tool_preview_enlarge({ name: file.name });
  const onError = () => setFailed(true);
  const viewer = open && (
    <Suspense>
      <MediaViewer kind={kind} url={url} name={file.name} onClose={() => setOpen(false)} />
    </Suspense>
  );

  if (size === "sm") {
    return (
      <>
        {failed ? (
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
            data-preview="unavailable"
          >
            {kind === "image" ? <ImageIcon /> : <VideoIcon />}
          </span>
        ) : (
          <button
            type="button"
            aria-label={label}
            data-preview={kind}
            onClick={() => setOpen(true)}
            className="relative size-12 shrink-0 cursor-zoom-in overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            {kind === "image" ? (
              <img src={url} alt="" className="size-full object-cover" onError={onError} />
            ) : (
              <>
                {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- 访客自己的文件，没有字幕 */}
                <video
                  src={`${url}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                  className="size-full object-cover"
                  onError={onError}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/30 text-background">
                  <PlayIcon />
                </span>
              </>
            )}
          </button>
        )}
        {viewer}
      </>
    );
  }

  if (failed) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted" data-preview={kind}>
      {kind === "image" ? (
        <button
          type="button"
          aria-label={label}
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <img
            src={url}
            alt={file.name}
            className="mx-auto max-h-64 w-auto max-w-full object-contain"
            onError={onError}
          />
        </button>
      ) : (
        <>
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- 访客自己的文件，没有字幕 */}
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            aria-label={file.name}
            className="mx-auto max-h-64 w-auto max-w-full"
            onError={onError}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label={label}
            className="absolute top-2 right-2"
            onClick={() => setOpen(true)}
          >
            <Maximize2Icon />
          </Button>
        </>
      )}
      {viewer}
    </div>
  );
}
