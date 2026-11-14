import { ArrowLeftRightIcon } from "lucide-react";
import { type KeyboardEvent, type PointerEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useObjectUrl } from "@/hooks/use-object-url";
import {
  type Aspect,
  centeredCrop,
  fitsIn,
  formatCrop,
  type Orientation,
  orientedSize,
  parseCrop,
  type Rect,
  ratioOf,
  type Size,
  swapAspect,
} from "@/lib/image/crop";
import { m } from "@/paraglide/messages";

// 拖动的是整个框（move）还是某个角：sx / sy 是这个角相对对角的方向。
// 角上的手柄放在框内：框贴着图片边缘时，伸出去的部分会被预览区裁掉、点不到
type Grip = "move" | { sx: 1 | -1; sy: 1 | -1 };

const corners = [
  { sx: -1, sy: -1, className: "left-0 top-0 cursor-nwse-resize" },
  { sx: 1, sy: -1, className: "right-0 top-0 cursor-nesw-resize" },
  { sx: -1, sy: 1, className: "bottom-0 left-0 cursor-nesw-resize" },
  { sx: 1, sy: 1, className: "bottom-0 right-0 cursor-nwse-resize" },
] as const;

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const readRect = (value: string, size: Size) => {
  try {
    const rect = parseCrop(value);
    return rect && fitsIn(rect, size) ? rect : undefined;
  } catch {
    // 写错的文本由提交时的校验报出
    return undefined;
  }
};

// 拖动角时，对角固定；锁定比例时宽度跟着指针、高度按比例，超出图像时再按高度收回
const resized = (
  start: Rect,
  grip: { sx: 1 | -1; sy: 1 | -1 },
  point: Size,
  size: Size,
  ratio?: number,
) => {
  const anchorX = grip.sx > 0 ? start.x : start.x + start.width;
  const anchorY = grip.sy > 0 ? start.y : start.y + start.height;
  const maxWidth = grip.sx > 0 ? size.width - anchorX : anchorX;
  const maxHeight = grip.sy > 0 ? size.height - anchorY : anchorY;
  let width = clamp(grip.sx * (point.width - anchorX), 1, maxWidth);
  let height = clamp(grip.sy * (point.height - anchorY), 1, maxHeight);
  if (ratio !== undefined) {
    height = width / ratio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }
  }
  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));
  return {
    x: grip.sx > 0 ? anchorX : anchorX - width,
    y: grip.sy > 0 ? anchorY : anchorY - height,
    width,
    height,
  };
};

// 裁剪区域字段（widget: "crop"）的拖拽框：选了图片后才加载。
// 编辑的就是字段里的 "x, y, width, height"（lib/image/crop.ts），坐标在旋转、翻转后的图上；
// 字段为空时显示 core 的默认区域（按比例居中），文本框暂时写错时保留上一次的框
export default function CropEditor({
  file,
  value,
  onChange,
  orientation,
  aspect,
  onAspectChange,
}: {
  file: File;
  value: string;
  onChange: (value: string) => void;
  orientation: Orientation;
  aspect: Aspect;
  onAspectChange: (aspect: Aspect) => void;
}) {
  const url = useObjectUrl(file);
  // 按 EXIF 摆正后的尺寸，和 core 的 createImageBitmap 一致；换了文件要等新图加载
  const [loaded, setLoaded] = useState<{ file: File; size: Size }>();
  const natural = loaded?.file === file ? loaded.size : undefined;
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ grip: Grip; start: Rect; pointer: Size }>(undefined);

  const size = useMemo(
    () => natural && orientedSize(natural, orientation.rotate),
    [natural, orientation.rotate],
  );
  const parsed = useMemo(() => size && readRect(value, size), [value, size]);
  // 上一次能读懂的框只对同一个尺寸（同一张图、同一个旋转）有效
  const [lastValid, setLastValid] = useState<{ rect: Rect; size: Size }>();
  if (parsed && parsed !== lastValid?.rect) setLastValid({ rect: parsed, size: size! });
  const rect =
    parsed ??
    (value.trim() !== "" && lastValid && lastValid.size === size ? lastValid.rect : undefined) ??
    (size && centeredCrop(size, aspect));
  const ratio = ratioOf(aspect);

  // 指针位置换算成图像像素
  const pointOf = (event: PointerEvent): Size => {
    const box = frame.current!.getBoundingClientRect();
    return {
      width: ((event.clientX - box.left) / box.width) * size!.width,
      height: ((event.clientY - box.top) / box.height) * size!.height,
    };
  };

  const startDrag = (grip: Grip) => (event: PointerEvent<HTMLElement>) => {
    if (!rect || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { grip, start: rect, pointer: pointOf(event) };
  };

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current || !size) return;
    const point = pointOf(event);
    const { grip, start } = current;
    if (grip === "move") {
      const x = clamp(
        Math.round(start.x + point.width - current.pointer.width),
        0,
        size.width - start.width,
      );
      const y = clamp(
        Math.round(start.y + point.height - current.pointer.height),
        0,
        size.height - start.height,
      );
      onChange(formatCrop({ ...start, x, y }));
    } else {
      onChange(formatCrop(resized(start, grip, point, size, ratio)));
    }
  };

  const endDrag = () => {
    drag.current = undefined;
  };

  // 方向键移动框：每次 1 像素，按住 Shift 时 10 像素
  const onKeyDown = (event: KeyboardEvent) => {
    if (!rect || !size) return;
    const step = event.shiftKey ? 10 : 1;
    const delta = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    onChange(
      formatCrop({
        ...rect,
        x: clamp(rect.x + delta[0]!, 0, size.width - rect.width),
        y: clamp(rect.y + delta[1]!, 0, size.height - rect.height),
      }),
    );
  };

  const { rotate, flipHorizontal, flipVertical } = orientation;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frame}
        className="relative mx-auto w-full overflow-hidden rounded-xl bg-muted select-none"
        style={
          size && {
            aspectRatio: `${size.width} / ${size.height}`,
            maxWidth: `calc(28rem * ${size.width / size.height})`,
          }
        }
        data-crop-editor={size ? "" : undefined}
      >
        {/* 旋转 90° 时 <img> 自身的布局不转，按旋转前的尺寸放在中心再用 CSS 变换：先旋转，再翻转 */}
        <img
          src={url}
          alt=""
          draggable={false}
          className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
          style={
            natural && size
              ? {
                  width: percent(natural.width, size.width),
                  height: percent(natural.height, size.height),
                  transform: `translate(-50%, -50%) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1}) rotate(${rotate}deg)`,
                }
              : { visibility: "hidden" }
          }
          onLoad={(event) =>
            setLoaded({
              file,
              size: {
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              },
            })
          }
        />
        {rect && size && (
          // 可以聚焦的按钮：拖动或用方向键移动
          <button
            type="button"
            aria-label={m.form_crop_area({ size: `${rect.width} × ${rect.height}` })}
            className="absolute cursor-move touch-none rounded-none shadow-[0_0_0_9999px] shadow-background/70 outline-2 outline-primary focus-visible:outline-4"
            style={{
              left: percent(rect.x, size.width),
              top: percent(rect.y, size.height),
              width: percent(rect.width, size.width),
              height: percent(rect.height, size.height),
            }}
            data-crop-box
            onPointerDown={startDrag("move")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          >
            {corners.map(({ sx, sy, className }) => (
              <span
                key={className}
                aria-hidden
                className={`absolute size-4 touch-none rounded-full border-2 border-primary bg-background ${className}`}
                data-crop-corner={`${sx > 0 ? "right" : "left"}-${sy > 0 ? "bottom" : "top"}`}
                onPointerDown={startDrag({ sx, sy })}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            ))}
          </button>
        )}
      </div>
      {rect && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground tabular-nums">
            {rect.width} × {rect.height} px
          </span>
          {aspect !== "free" && aspect !== "1:1" && (
            <Button variant="outline" size="sm" onClick={() => onAspectChange(swapAspect(aspect))}>
              <ArrowLeftRightIcon />
              {m.form_crop_swap({ aspect: swapAspect(aspect) })}
            </Button>
          )}
          {value.trim() !== "" && (
            <Button variant="outline" size="sm" onClick={() => onChange("")}>
              {m.form_crop_reset()}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
