import { describe, expect, it } from "vitest";

import { ortWasmFile } from "@/tools/speech-to-text/model";

import { createModelFetch, loadHostedFile } from "./model-files";

const sha256 = async (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

// 依赖 scripts/fetch-models.ts 写好的 public/models/
describe("model files", () => {
  it("joins the parts of a split file back into the original", async () => {
    let bytes = 0;
    const buffer = await loadHostedFile(ortWasmFile, { onBytes: (count) => (bytes += count) });
    expect(buffer.byteLength).toBe(ortWasmFile.size);
    expect(await sha256(buffer)).toBe(ortWasmFile.sha256);
    expect(bytes).toBe(ortWasmFile.size);
  });

  it("serves manifest files from the cache and passes other requests through", async () => {
    const modelFetch = createModelFetch([ortWasmFile], () => ({}));
    const response = await modelFetch(`/models/${ortWasmFile.path}`);
    expect(response.headers.get("Content-Length")).toBe(String(ortWasmFile.size));
    expect(
      await (
        await caches.open("models")
      ).match(response.url || location.origin + `/models/${ortWasmFile.path}`),
    ).toBeDefined();
    expect((await modelFetch("/models/missing.json")).status).toBe(404);
  });
});
