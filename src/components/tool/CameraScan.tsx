import { useEffect, useRef, useState } from "react";
import * as v from "valibot";

import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnyTool } from "@/lib/tool-contract/define-tool";
import { withBlankNumbersOmitted } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

import { previewTool } from "./invoke";

// 两帧之间的间隔；上一帧没跑完不截下一帧
const INTERVAL = 250;
// 截帧的长边上限：够读码，又不让 Worker 每帧处理整张高清画面
const MAX_SIDE = 1280;

const captureFrame = async (video: HTMLVideoElement): Promise<File | undefined> => {
  const { videoWidth: width, videoHeight: height } = video;
  if (width === 0 || height === 0) return undefined;
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const canvas = new OffscreenCanvas(Math.round(width * scale), Math.round(height * scale));
  canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });
  return new File([blob], "camera.jpg", { type: "image/jpeg" });
};

// 摄像头取景（字段元数据 camera: "scan"，ADR-0025）：逐帧作为该字段的输入运行 Tool，
// 没有结果的帧静默跳过、不计遥测；第一次成功就关闭摄像头，把那一帧交给表单（由表单正常运行一次）
export default function CameraScan({
  tool,
  field,
  values,
  onDetected,
  onClose,
}: {
  tool: AnyTool;
  field: string;
  // 表单里其他字段的当前值
  values: () => Record<string, unknown>;
  onDetected: (file: File) => void;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const controller = new AbortController();
    const { signal } = controller;
    let stream: MediaStream | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scan = async () => {
      if (signal.aborted) return;
      const frame = await captureFrame(element).catch(() => undefined);
      if (frame && !signal.aborted) {
        const parsed = v.safeParse(
          tool.input,
          withBlankNumbersOmitted(tool.input, { ...values(), [field]: frame }),
        );
        if (parsed.success) {
          const found = await previewTool(tool, parsed.output, { signal }).then(
            () => true,
            () => false,
          );
          if (found && !signal.aborted) {
            controller.abort();
            onDetected(frame);
            return;
          }
        }
      }
      if (!signal.aborted) timer = setTimeout(() => void scan(), INTERVAL);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(async (media) => {
        stream = media;
        if (signal.aborted) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        element.srcObject = media;
        await element.play();
        void scan();
      })
      .catch(() => {
        if (!signal.aborted) setFailed(true);
      });

    // 切到后台就关闭摄像头
    const onHidden = () => {
      if (document.visibilityState === "hidden") onClose();
    };
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      controller.abort();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHidden);
      // 成功、关闭和卸载都要停掉所有轨道，浏览器的摄像头指示灯才会熄灭
      stream?.getTracks().forEach((track) => track.stop());
      element.srcObject = null;
    };
    // values、onDetected、onClose 每次渲染都是新函数；只在打开摄像头时启动一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, field]);

  if (failed) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.form_camera_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-muted" data-camera>
      <video ref={video} muted playsInline className="mx-auto max-h-80 w-full object-contain" />
    </div>
  );
}
