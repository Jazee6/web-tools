// 输出的每条边上限；手机浏览器的画布面积上限可能更小，由 core 报 too_large
export const MAX_SIDE = 10_000;

export type Fit = "contain" | "cover" | "stretch";

export interface Size {
  width: number;
  height: number;
}

// 输出尺寸和取样区域（源图坐标）。只给一边时按原比例算出另一边，fit 不起作用；
// 两边都给时：contain 放进这个框、保持比例；cover 铺满并居中裁掉多余部分；stretch 拉伸到这个尺寸
export const planResize = (
  source: Size,
  target: { width?: number; height?: number; fit: Fit },
): Size & { crop: Size & { x: number; y: number } } => {
  const whole = { x: 0, y: 0, width: source.width, height: source.height };
  const { width, height, fit } = target;
  const ratio = source.width / source.height;

  if (width === undefined || height === undefined) {
    return width !== undefined
      ? { width, height: Math.max(1, Math.round(width / ratio)), crop: whole }
      : { width: Math.max(1, Math.round(height! * ratio)), height: height!, crop: whole };
  }
  if (fit === "stretch") return { width, height, crop: whole };
  if (fit === "contain") {
    const scale = Math.min(width / source.width, height / source.height);
    return {
      width: Math.max(1, Math.round(source.width * scale)),
      height: Math.max(1, Math.round(source.height * scale)),
      crop: whole,
    };
  }
  const scale = Math.max(width / source.width, height / source.height);
  const cropWidth = Math.max(1, Math.round(width / scale));
  const cropHeight = Math.max(1, Math.round(height / scale));
  return {
    width,
    height,
    crop: {
      x: Math.round((source.width - cropWidth) / 2),
      y: Math.round((source.height - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
    },
  };
};
