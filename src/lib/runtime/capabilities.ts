import type { Capability } from "@/lib/tool-contract/define-tool";

// 能力探测（architecture §13）：只在浏览器里、水合之后调用；缺失时页面显示 Empty 说明原因，不做降级实现。
const probes: Record<Capability, () => boolean | Promise<boolean>> = {
  wasm: () => typeof WebAssembly === "object",
  webcodecs: () => "VideoEncoder" in globalThis && "VideoDecoder" in globalThis,
  webgpu: async () => {
    const gpu = (navigator as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    return Boolean(await gpu?.requestAdapter().catch(() => null));
  },
  opfs: async () => {
    try {
      await navigator.storage.getDirectory();
      return true;
    } catch {
      return false;
    }
  },
};

// 能力名是技术名词，各 Locale 都用原文
export const capabilityNames: Record<Capability, string> = {
  wasm: "WebAssembly",
  webcodecs: "WebCodecs",
  webgpu: "WebGPU",
  opfs: "Origin Private File System",
};

export const missingCapabilities = async (
  required: readonly Capability[],
): Promise<Capability[]> => {
  const results = await Promise.all(required.map(async (capability) => probes[capability]()));
  return required.filter((_, index) => !results[index]);
};
