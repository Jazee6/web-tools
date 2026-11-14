import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

import type { MediaKind } from "./FilePreview";

// 放大查看图片 / 视频；桌面端用 Dialog，移动端用 Drawer（UI 规则）。
// 只在点击放大后才加载，关闭时内容卸载，视频随之停止播放
function Media({ kind, url, name }: { kind: MediaKind; url: string; name: string }) {
  return kind === "image" ? (
    <img src={url} alt={name} className="mx-auto max-h-[80dvh] w-auto max-w-full object-contain" />
  ) : (
    // oxlint-disable-next-line jsx-a11y/media-has-caption -- 访客自己的文件，没有字幕
    <video
      src={url}
      controls
      playsInline
      className="mx-auto max-h-[80dvh] w-auto max-w-full"
      aria-label={name}
    />
  );
}

export default function MediaViewer({
  kind,
  url,
  name,
  onClose,
}: {
  kind: MediaKind;
  url: string;
  name: string;
  onClose: () => void;
}) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const onOpenChange = (open: boolean) => !open && onClose();

  if (desktop) {
    return (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent variant="media">
          <DialogHeader className="sr-only">
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <Media kind={kind} url={url} name={name} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{name}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Media kind={kind} url={url} name={name} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
