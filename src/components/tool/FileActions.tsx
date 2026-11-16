import { CameraIcon, XIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

const noopSubscribe = () => () => {};

// 单文件字段旁的按钮：用摄像头取景（camera: "scan"）、移除可选文件。
// 懒加载，图标和文案不进其他 Tool 页的首屏
export default function FileActions({
  camera,
  scanning,
  onToggleCamera,
  removable,
  onRemove,
}: {
  camera: boolean;
  scanning: boolean;
  onToggleCamera: () => void;
  removable: boolean;
  onRemove: () => void;
}) {
  // 浏览器能不能用摄像头（需要安全上下文）；服务端渲染时按不能处理
  const cameraSupported = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.mediaDevices?.getUserMedia === "function",
    () => false,
  );
  return (
    <>
      {camera && (
        <Button
          type="button"
          variant="outline"
          disabled={!cameraSupported}
          aria-pressed={scanning}
          onClick={onToggleCamera}
        >
          <CameraIcon />
          {scanning ? m.form_camera_stop() : m.form_camera_start()}
        </Button>
      )}
      {/* 可选的文件字段可以移除，回到不选文件的状态 */}
      {removable && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={m.form_remove()}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      )}
    </>
  );
}
