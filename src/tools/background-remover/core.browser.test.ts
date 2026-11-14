import { describe, expect, it } from "vitest";

import type { ProgressStage } from "@/lib/tool-contract/define-tool";

import { loadExampleFile } from "../example-files";
import { type Backend, detectBackend, parseColor, removeBackground } from "./core";

const example = (name: string) => loadExampleFile("background-remover", name);

// 读出结果图在几个点上的 RGBA
const sample = async (file: File, points: [number, number][]) => {
  const bitmap = await createImageBitmap(file);
  const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return {
    size: [bitmap.width, bitmap.height],
    pixels: points.map(([x, y]) => [...context.getImageData(x, y, 1, 1).data]),
  };
};

// 样例：480 × 360 的图，中间是一个橙色的球（圆心 240, 170），背景是墙和桌面
const CENTER: [number, number] = [240, 170];
const WALL: [number, number] = [10, 10];
const TABLE: [number, number] = [470, 350];

// WASM 路径在所有浏览器上都跑；WebGPU 路径只在有真实 GPU 且支持 shader-f16 的浏览器上跑
// （本机 macOS 上的 WebKit；headless Chromium 只有软件回退的 SwiftShader，Linux CI 上通常都没有）
const backends: Backend[] = (await detectBackend()) === "webgpu" ? ["wasm", "webgpu"] : ["wasm"];

describe.each(backends)("removeBackground on %s", (backend) => {
  it("keeps the subject and makes the background transparent", async () => {
    const progress: [number, ProgressStage | undefined][] = [];
    const { file } = await removeBackground(
      { file: await example("ball.jpg"), format: "png", background: "", quality: 90 },
      { onProgress: (ratio, stage) => progress.push([ratio, stage]) },
      backend,
    );
    expect(file.type).toBe("image/png");
    expect(file.name).toBe("ball-no-bg.png");
    const { size, pixels } = await sample(file, [CENTER, WALL, TABLE]);
    expect(size).toEqual([480, 360]);
    const [center, wall, table] = pixels;
    expect(center![3]).toBeGreaterThan(240);
    // 主体颜色保持原样（橙色）
    expect(center![0]).toBeGreaterThan(center![2]! + 100);
    expect(wall![3]).toBeLessThan(16);
    expect(table![3]).toBeLessThan(16);
    // 每个测试文件里首次用某种后端时加载模型（缓存命中也按文件大小回报），下载阶段走到 100%
    expect(progress.findLast(([, stage]) => stage === "download")?.[0]).toBe(1);
    expect(progress.at(-1)).toEqual([1, undefined]);
  }, 300_000);

  it("fills the background with a color and decodes HEIC", async () => {
    const { file } = await removeBackground(
      { file: await example("ball.heic"), format: "jpeg", background: "#00ff00", quality: 90 },
      {},
      backend,
    );
    expect(file.type).toBe("image/jpeg");
    expect(file.name).toBe("ball-no-bg.jpg");
    const { pixels } = await sample(file, [CENTER, WALL]);
    const [center, wall] = pixels;
    // 背景变成纯绿（JPEG 有压缩误差），主体仍是橙色
    expect(wall![0]).toBeLessThan(16);
    expect(wall![1]).toBeGreaterThan(240);
    expect(wall![2]).toBeLessThan(16);
    expect(center![0]).toBeGreaterThan(center![1]!);
  }, 300_000);
});

describe("removeBackground", () => {
  it("writes WebP with transparency", async () => {
    const { file } = await removeBackground({
      file: await example("ball.jpg"),
      format: "webp",
      background: "",
      quality: 80,
    });
    expect(file.type).toBe("image/webp");
    expect(file.name).toBe("ball-no-bg.webp");
    const { pixels } = await sample(file, [CENTER, WALL]);
    expect(pixels[0]![3]).toBeGreaterThan(240);
    expect(pixels[1]![3]).toBeLessThan(16);
  }, 300_000);

  it("requires a background color for JPEG before loading the model", async () => {
    await expect(
      removeBackground({
        file: await example("ball.jpg"),
        format: "jpeg",
        background: "",
        quality: 90,
      }),
    ).rejects.toMatchObject({ code: "background_required", field: "background" });
  });

  it("rejects files that are not images", async () => {
    const garbage = new File(["not an image"], "broken.png", { type: "image/png" });
    await expect(
      removeBackground({ file: garbage, format: "png", background: "", quality: 90 }),
    ).rejects.toMatchObject({ code: "decode_failed", field: "file" });
  });

  // 解码后、加载模型和推理后都会检查中止信号
  it("cancels when aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      removeBackground(
        { file: await example("ball.jpg"), format: "png", background: "", quality: 90 },
        { signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("parseColor", () => {
  it("reads hex colors with or without #, in short or long form", () => {
    expect(parseColor("")).toBeUndefined();
    expect(parseColor("  ")).toBeUndefined();
    expect(parseColor("#ffffff")).toEqual([255, 255, 255]);
    expect(parseColor("00FF80")).toEqual([0, 255, 128]);
    expect(parseColor("#f0a")).toEqual([255, 0, 170]);
  });

  it("rejects anything else", () => {
    for (const text of ["white", "#ffff", "#12345g", "rgb(0,0,0)"]) {
      expect(() => parseColor(text)).toThrow(
        expect.objectContaining({ code: "invalid_color", field: "background", detail: text }),
      );
    }
  });
});
