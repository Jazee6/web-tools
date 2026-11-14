// 仅在 postbuild 执行，不进入 Worker / 页面首屏 JS。
// 约定：版本漂移 = warning，缺失许可证或归属 = error。
// 写死的已核对版本与安装版本不一致时只警告（构建继续，postbuild 结束时汇总）；
// 许可证原文校验失败、缺 chunk、无法归属、找不到许可证全文、空清单、缺注入点则直接失败。
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

import { locales, localizePath } from "../../src/lib/i18n/locales";
import { models as birefnetModels } from "../../src/tools/background-remover/model";
import { detectionFile, recognitionFile } from "../../src/tools/image-to-text/model";
import { MODEL_ID, MODEL_REVISION } from "../../src/tools/speech-to-text/model";

interface ChunkRecord {
  chunk: string;
  modules: string[];
}
interface Component {
  name: string;
  version: string;
  license: string;
  source: string;
  chunks: string[];
  texts: { name: string; path: string }[];
}
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const hashFile = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const safeName = (name: string) => name.replace(/[^a-zA-Z0-9.-]/g, "_");
const walk = (root: string): string[] =>
  readdirSync(root, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(root, e.name)) : [join(root, e.name)],
  );

// 沿真实模块路径找所属 manifest，兼容 scoped 包、嵌套 node_modules 和带 query 的 Vite id。
export const packageRoot = (id: string): string | undefined => {
  const file = id.replace(/^\0/, "").split("?")[0]!;
  // 这几个虚拟模块确实有代码进入 chunk；只声明它们的 runtime，不把全部构建依赖当分发代码。
  const virtual =
    file === "rolldown/runtime.js"
      ? "rolldown"
      : file === "vite/preload-helper.js" || file === "__vite-browser-external"
        ? "vite"
        : undefined;
  if (virtual) return resolve("node_modules", virtual);
  if (!file.includes("/node_modules/")) return;
  for (let dir = dirname(file); dir !== dirname(dir); dir = dirname(dir)) {
    const manifest = join(dir, "package.json");
    if (existsSync(manifest)) {
      const data = readJson(manifest);
      if (typeof data.name === "string" && typeof data.version === "string") return dir;
    }
  }
};

const extraTexts: Record<string, string[]> = {
  "@embedpdf/pdfium": ["LICENSE.pdfium"],
  "@jsquash/jpeg": ["codec/LICENSE.codec.md"],
  "@jsquash/webp": ["codec/LICENSE.codec.md"],
  "@jsquash/oxipng": ["codec/LICENSE.codec.md"],
  "libheif-js": ["libheif-wasm/LICENSE"],
  rolldown: ["THIRD-PARTY-LICENSE"],
};
// 用于提醒升级后重新核对原生许可证证据，不阻止构建；页面显示版本始终来自 manifest。
const verifiedNativeParents: Record<string, string> = {
  "@embedpdf/pdfium": "2.15.1",
  "@jsquash/jpeg": "1.6.0",
  "@jsquash/webp": "1.5.0",
  "@jsquash/avif": "2.1.1",
  "@jsquash/oxipng": "2.3.0",
  "libheif-js": "1.23.5",
  "@mediabunny/mp3-encoder": "1.62.1",
};
const sourceOverrides: Record<string, string> = {
  "@embedpdf/pdfium":
    "https://github.com/embedpdf/embed-pdf-viewer/tree/4db40e21c91d7767fc0cce21802b83ccd68e48e2/packages/pdfium",
  "libheif-js": "https://github.com/catdad-experiments/libheif-js",
  mediabunny: "https://github.com/Vanilagy/mediabunny",
  "@mediabunny/mp3-encoder": "https://github.com/Vanilagy/mediabunny",
};

// 版本漂移判定：一致返回 undefined，否则返回 warning 文案（哪个包、期望、实际）。
export const versionDrift = (
  name: string,
  expected: string,
  actual: string | undefined,
): string | undefined =>
  actual === expected
    ? undefined
    : `${name}：期望 ${expected}，实际 ${actual ?? "未找到"}。请重新核对该组件的许可证文本和源码链接`;

export const createVersionWarnings = () => {
  const warnings = new Set<string>();
  const checkVersion = (name: string, expected: string, actual: string | undefined) => {
    const warning = versionDrift(name, expected, actual);
    if (warning && !warnings.has(warning)) {
      warnings.add(warning);
      console.warn(`⚠ 许可证版本漂移 ${warning}`);
    }
  };
  return { warnings, checkVersion };
};

export const printVersionWarnings = (warnings: readonly string[]) => {
  if (warnings.length > 0)
    console.warn(
      `\n⚠ 许可证版本漂移 ${warnings.length} 项（构建已继续，请重新核对许可证文本和源码链接）：\n${warnings.map((w) => `  - ${w}`).join("\n")}`,
    );
};

export const readLameMetadata = (path: string) => {
  const readmePath = existsSync(path) ? path : undefined;
  const readme = readmePath ? readFileSync(readmePath, "utf8") : "";
  const version = /LAME\s+v?(\d+\.\d+(?:\.\d+)?)/i.exec(readme)?.[1];
  return {
    version: version ?? "unknown",
    source: version
      ? `https://downloads.sourceforge.net/project/lame/lame/${version}/lame-${version}.tar.gz`
      : "https://sourceforge.net/projects/lame/files/lame/",
    readmePath,
  };
};

export const injectLicenseMarkdown = (source: string, inventory: string): string => {
  const marker = "<!-- third-party-notices -->";
  if (!source.includes(marker)) throw new Error("缺少许可证 Markdown 注入点");
  return source.replace(marker, () => inventory);
};

export const generateLicenses = (root: string) => {
  const { warnings, checkVersion } = createVersionWarnings();
  const upstream = readJson("licenses/upstream/sources.json") as Record<string, { sha256: string }>;
  for (const [file, evidence] of Object.entries(upstream)) {
    const sha = createHash("sha256")
      .update(readFileSync(`licenses/upstream/${file}`))
      .digest("hex");
    if (sha !== evidence.sha256) throw new Error(`上游许可证原文校验失败: ${file}`);
  }
  const records = readFileSync(".astro/client-modules.jsonl", "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as ChunkRecord);
  const packages = new Map<string, { dir: string; chunks: Set<string> }>();
  for (const record of records) {
    // Astro 会内联只有本站代码的短脚本。第三方 chunk 若缺失则必须人工核对，不能默默漏记。
    if (!existsSync(join(root, record.chunk))) {
      if (record.modules.some((id) => packageRoot(id)))
        throw new Error(`许可证库存引用缺失第三方 chunk: ${record.chunk}`);
      continue;
    }
    for (const id of record.modules) {
      const dir = packageRoot(id);
      if (!dir) {
        if (!id.startsWith("/")) throw new Error(`未归属的构建虚拟模块: ${id}`);
        continue;
      }
      const { name, version } = readJson(join(dir, "package.json"));
      const key = `${name}@${version}`;
      const item = packages.get(key) ?? { dir, chunks: new Set<string>() };
      item.chunks.add(record.chunk);
      packages.set(key, item);
    }
  }
  if (!packages.size) throw new Error("没有采集到客户端许可证模块，拒绝生成空清单");
  for (const [name, version] of Object.entries(verifiedNativeParents)) {
    if (packages.has(`${name}@${version}`)) continue;
    const installed = [...packages.keys()]
      .filter((key) => key.startsWith(`${name}@`))
      .map((key) => key.slice(name.length + 1));
    checkVersion(name, version, installed.length ? installed.join(", ") : undefined);
  }
  // 字体在 CSS 或栅格图中使用，不出现在 JS chunk.modules。
  for (const name of [
    "@fontsource-variable/inter",
    "@fontsource/noto-sans-sc",
    "@fontsource/noto-sans-jp",
  ]) {
    const dir = resolve("node_modules", name);
    const { version } = readJson(join(dir, "package.json"));
    packages.set(`${name}@${version}`, {
      dir,
      chunks: new Set([
        name.includes("inter") ? "_astro/*.woff2 (CSS)" : "og/*.png (rasterized only)",
      ]),
    });
  }
  // CSS 的 @import 会被 Tailwind 合并，未必留下 JS 模块；从真实样式入口补齐这些包。
  const stylesheets = walk(root)
    .filter((path) => path.endsWith(".css"))
    .map((path) => relative(root, path));
  for (const file of walk("src").filter((path) => path.endsWith(".css"))) {
    for (const match of readFileSync(file, "utf8").matchAll(/@import\s+["']([^"']+)["']/g)) {
      const specifier = match[1]!;
      if (specifier.startsWith(".") || specifier.startsWith("/")) continue;
      if (/^(?:https?:|url\()/.test(specifier))
        throw new Error(`外部 CSS 需核对许可证: ${specifier}`);
      const name = specifier
        .split("/")
        .slice(0, specifier.startsWith("@") ? 2 : 1)
        .join("/");
      const dir = resolve("node_modules", name);
      const { version } = readJson(join(dir, "package.json"));
      const key = `${name}@${version}`;
      const item = packages.get(key) ?? { dir, chunks: new Set<string>() };
      for (const path of stylesheets) item.chunks.add(path);
      packages.set(key, item);
    }
  }
  const target = join(root, "third-party-notices");
  mkdirSync(target, { recursive: true });
  const saveText = (id: string, name: string, path: string) => {
    const dest = `${safeName(id)}-${safeName(name)}.txt`;
    const bytes = readFileSync(path);
    writeFileSync(join(target, dest), bytes);
    return { name, path: `/third-party-notices/${dest}` };
  };
  const components: Component[] = [];
  for (const { dir, chunks } of packages.values()) {
    const pkg = readJson(join(dir, "package.json"));
    const expected = verifiedNativeParents[pkg.name];
    if (expected) checkVersion(pkg.name, expected, pkg.version);
    const names = readdirSync(dir).filter(
      (name) =>
        /^(?:licen[sc]e|copying|notice|thirdpartynotices)(?:[.-].*)?$/i.test(name) &&
        statSync(join(dir, name)).isFile(),
    );
    names.push(...(extraTexts[pkg.name] ?? []));
    let source =
      typeof pkg.repository === "string"
        ? pkg.repository
        : (pkg.repository?.url ?? pkg.homepage ?? "");
    source =
      sourceOverrides[pkg.name] ??
      source
        .replace(/^git\+/, "")
        .replace(/^git:\/\//, "https://")
        .replace(/\.git$/, "");
    if (!source.startsWith("https://"))
      source = `https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`;
    const texts = [...new Set(names)].map((name) =>
      saveText(`${pkg.name}@${pkg.version}`, name, join(dir, name)),
    );
    if (pkg.name === "onnxruntime-web" || pkg.name === "onnxruntime-common") {
      const common = pkg.name === "onnxruntime-common";
      checkVersion(
        pkg.name,
        common ? "1.31.0-dev.20260911-2a43ec07e" : "1.31.0-dev.20260914-8d85527a0",
        pkg.version,
      );
      const prefix = common ? "onnx-common" : "onnx";
      for (const suffix of ["LICENSE", "ThirdPartyNotices.txt"]) {
        const name = `${prefix}-${suffix}`;
        texts.push(saveText(`${pkg.name}@${pkg.version}`, name, `licenses/upstream/${name}`));
      }
    }
    if (pkg.name === "squoosh-oxipng") {
      texts.push(
        saveText(
          `${pkg.name}@${pkg.version}`,
          "LICENSE.codec.md",
          "node_modules/@jsquash/oxipng/codec/LICENSE.codec.md",
        ),
      );
      source = "https://github.com/jamsinclair/jSquash/tree/main/packages/oxipng/codec";
    }
    if (pkg.name === "react-remove-scroll-bar") {
      checkVersion(pkg.name, "2.3.8", pkg.version);
      texts.push(
        saveText(
          `${pkg.name}@${pkg.version}`,
          "upstream-LICENSE",
          "licenses/upstream/react-remove-scroll-bar-LICENSE",
        ),
      );
    }
    if (pkg.name === "mediabunny" || pkg.name === "@mediabunny/mp3-encoder") {
      source = `https://registry.npmjs.org/${pkg.name}/-/${pkg.name.split("/").at(-1)}-${pkg.version}.tgz`;
    }
    if (!texts.length)
      throw new Error(`客户端包 ${pkg.name}@${pkg.version} 未找到许可证全文；请核对上游后补充`);
    components.push({
      name: pkg.name,
      version: pkg.version,
      license:
        pkg.name === "squoosh-oxipng"
          ? "MIT (OxiPNG)"
          : typeof pkg.license === "string"
            ? pkg.license
            : (pkg.license?.type ?? "SEE LICENSE"),
      source,
      chunks: [...chunks].toSorted(),
      texts,
    });
  }
  const addBundled = (
    name: string,
    parent: string,
    license: string,
    source: string,
    files: string[],
    version?: string,
  ) => {
    const owner = components.find((c) => c.name === parent);
    if (!owner) throw new Error(`缺少原生组件的客户端父包 ${parent}`);
    components.push({
      name,
      version: version ?? `${parent}@${owner.version}`,
      license,
      source,
      chunks: owner.chunks,
      texts: files.map((file) => saveText(name, file, `licenses/upstream/${file}`)),
    });
  };
  addBundled(
    "PDFium bundled third-party notices (partial)",
    "@embedpdf/pdfium",
    "FTL / BSD / MIT / libtiff / AGG; closure pending",
    "https://github.com/embedpdf/pdfium/tree/73a041a5c1aaffa09ebb64f1981ff501cb91a41c/third_party",
    [
      "freetype-FTL.TXT",
      "pdfium-OpenJPEG-LICENSE",
      "pdfium-lcms-LICENSE",
      "pdfium-libtiff-LICENSE.md",
      "pdfium-agg-agg_basics.h",
      "pdfium-jpeg-LICENSE.md",
      "pdfium-png-LICENSE",
      "pdfium-zlib-LICENSE",
    ],
  );
  addBundled(
    "MozJPEG / IJG",
    "@jsquash/jpeg",
    "BSD / IJG",
    "https://github.com/mozilla/mozjpeg/tree/v3.3.1",
    ["mozjpeg-README.ijg"],
  );
  addBundled(
    "libwebp",
    "@jsquash/webp",
    "BSD / patent terms",
    "https://github.com/webmproject/libwebp/tree/d2e245ea9e959a5a79e1db0ed2085206947e98f2",
    ["libwebp-COPYING", "libwebp-PATENTS"],
  );
  addBundled(
    "libavif / libaom / libsharpyuv",
    "@jsquash/avif",
    "BSD / AOM patent terms",
    "https://github.com/jamsinclair/jSquash/tree/main/packages/avif/codec",
    ["libavif-LICENSE", "libaom-LICENSE", "libaom-PATENTS", "webp-COPYING", "webp-PATENTS"],
  );
  addBundled(
    "libde265 (libheif build)",
    "libheif-js",
    "LGPL-3.0",
    "https://github.com/strukturag/libde265/tree/v1.0.15",
    ["libde265-COPYING"],
  );
  addBundled(
    "libheif source and build",
    "libheif-js",
    "LGPL-3.0",
    "https://github.com/strukturag/libheif/tree/413e2a87e6a70b3eccc3a3adc5801179dd2d9e00",
    [],
  );
  const lame = readLameMetadata("node_modules/@mediabunny/mp3-encoder/README.md");
  checkVersion("LAME（@mediabunny/mp3-encoder README）", "3.100", lame.version);
  addBundled(
    "LAME",
    "@mediabunny/mp3-encoder",
    "LGPL-2.0-or-later (GNU Library GPL)",
    lame.source,
    ["lame-COPYING"],
    lame.version,
  );
  if (lame.readmePath) {
    const mp3 = components.find((c) => c.name === "@mediabunny/mp3-encoder")!;
    mp3.texts.push(saveText(mp3.name, "source-build-instructions", lame.readmePath));
  }
  const whisperFiles = walk(join(root, "models")).filter((path) => path.includes(MODEL_REVISION));
  if (!whisperFiles.length) throw new Error("未找到固定 revision 的 Whisper 分发文件");
  components.push({
    name: `${MODEL_ID} (Whisper base)`,
    version: MODEL_REVISION,
    license: "MIT (upstream Whisper; ONNX conversion terms unverified)",
    source: `https://huggingface.co/${MODEL_ID}/tree/${MODEL_REVISION}`,
    chunks: whisperFiles.map((p) => relative(root, p)),
    texts: [
      saveText("whisper-base", "LICENSE", "licenses/upstream/whisper-LICENSE"),
      saveText("whisper-base", "model-card", "licenses/upstream/whisper-model-card.md"),
      saveText("whisper-base", "upstream-README", "licenses/upstream/whisper-upstream-README.md"),
    ],
  });
  // Background Remover 的两个 BiRefNet_lite 导出（权重相同，MIT）；训练数据 DIS5K 的使用条款风险见 ADR-0022
  const birefnetNotes = {
    webgpu: {
      label: "BiRefNet_lite, 1024 × 1024, WebGPU graph",
      texts: "birefnet-lite-onnx-webgpu",
    },
    wasm: { label: "BiRefNet_lite, 512 × 512", texts: "birefnet-lite-512" },
  } as const;
  for (const [backend, model] of Object.entries(birefnetModels) as [
    keyof typeof birefnetModels,
    (typeof birefnetModels)[keyof typeof birefnetModels],
  ][]) {
    const files = walk(join(root, "models")).filter((path) =>
      path.includes(`${model.id}/${model.revision}/`),
    );
    if (!files.length) throw new Error(`未找到固定 revision 的 ${model.id} 分发文件`);
    const { label, texts } = birefnetNotes[backend];
    components.push({
      name: `${model.id} (${label})`,
      version: model.revision,
      license:
        "MIT (BiRefNet weights; the DIS5K training set is licensed for non-commercial research only)",
      source: `https://huggingface.co/${model.id}/tree/${model.revision}`,
      chunks: files.map((p) => relative(root, p)),
      texts: [
        saveText(model.id, "LICENSE", `licenses/upstream/${texts}-LICENSE`),
        saveText(model.id, "model-card", `licenses/upstream/${texts}-model-card.md`),
        saveText(model.id, "upstream-LICENSE", "licenses/upstream/birefnet-LICENSE"),
      ],
    });
  }
  // Image to Text 的 PP-OCRv6 small 检测和识别模型：PaddlePaddle 官方 ONNX，Apache-2.0（ADR-0023）。
  // 模型仓库只有模型卡（license: apache-2.0），许可全文取 PaddleOCR 固定 tag 的 LICENSE
  for (const [file, label, card] of [
    [detectionFile, "text detection", "pp-ocrv6-small-det-model-card.md"],
    [recognitionFile, "text recognition", "pp-ocrv6-small-rec-model-card.md"],
  ] as const) {
    const [id, revision] = [dirname(dirname(file.path)), basename(dirname(file.path))];
    const files = walk(join(root, "models")).filter((path) => path.includes(`${id}/${revision}/`));
    if (!files.length) throw new Error(`未找到固定 revision 的 ${id} 分发文件`);
    components.push({
      name: `${id} (PP-OCRv6 small ${label})`,
      version: revision,
      license: "Apache-2.0",
      source: `https://huggingface.co/${id}/tree/${revision}`,
      chunks: files.map((p) => relative(root, p)),
      texts: [
        saveText(id, "LICENSE", "licenses/upstream/paddleocr-LICENSE"),
        saveText(id, "model-card", `licenses/upstream/${card}`),
      ],
    });
  }
  components.sort((a, b) => a.name.localeCompare(b.name));
  const assets = walk(root)
    .filter(
      (p) =>
        /\.(wasm|woff2?|ttf|otf|bin|onnx|part\d+)$/.test(p) ||
        p.includes("/models/") ||
        p.endsWith(".css") ||
        (p.endsWith(".js") && statSync(p).size > 100_000),
    )
    .map((p) => ({
      path: relative(root, p),
      bytes: statSync(p).size,
      sha256: createHash("sha256").update(readFileSync(p)).digest("hex"),
    }));
  // 独立 WASM / 字体按字节反向匹配已安装包；内联引擎由真实 Worker 模块图归属。
  const binaries = new Map<string, string[]>();
  for (const [key, { dir }] of packages) {
    if (key.includes("noto-sans")) continue; // 只用于 OG 栅格化，不分发原始字体
    for (const path of walk(dir).filter((p) => /\.(wasm|woff2?|ttf|otf)$/.test(p))) {
      const sha = hashFile(path);
      binaries.set(sha, [...(binaries.get(sha) ?? []), key]);
    }
  }
  const attributedAssets = assets.map((asset) => {
    const owners =
      binaries.get(asset.sha256) ??
      components
        .filter(
          (c) =>
            c.chunks.includes(asset.path) ||
            (asset.path.startsWith("models/onnxruntime-web/") && c.name === "onnxruntime-web"),
        )
        .map((c) => `${c.name}@${c.version}`);
    if (!owners.length) throw new Error(`分发资源无许可证归属: ${asset.path}`);
    return { ...asset, components: owners };
  });
  writeFileSync(
    join(target, "inventory.json"),
    `${JSON.stringify({ sources: "/third-party-notices/sources.json", components, assets: attributedAssets }, null, 2)}\n`,
  );
  writeFileSync(join(target, "sources.json"), readFileSync("licenses/upstream/sources.json"));
  for (const locale of locales) {
    const messages = readJson(`messages/${locale}.json`);
    const markdown = components
      .map(
        (c) =>
          `### ${c.name}\n\n${messages.licenses_version}: ${c.version} — ${c.license}\n\n[${messages.licenses_source}](${c.source})\n\n${c.texts.map((t) => `- [${messages.licenses_texts}: ${t.name}](${t.path})`).join("\n")}`,
      )
      .join("\n\n");
    const html =
      components
        .map(
          (c) =>
            `<section><h3>${escape(c.name)}</h3><p>${escape(messages.licenses_version)}: ${escape(c.version)} · ${escape(c.license)}</p><p><a href="${escape(c.source)}">${escape(messages.licenses_source)}</a></p><ul>${c.texts.map((t) => `<li><a href="${escape(t.path)}">${escape(messages.licenses_texts)}: ${escape(t.name)}</a></li>`).join("")}</ul></section>`,
        )
        .join("") +
      `<p><a href="/third-party-notices/inventory.json">${escape(messages.licenses_evidence)}</a></p>`;
    const path = join(root, `${localizePath(locale, "/licenses").slice(1)}.html`);
    const page = readFileSync(path, "utf8");
    const marker = /<div data-third-party-notices(?:="")?><\/div>/;
    if (!marker.test(page)) throw new Error(`缺少许可证 HTML 注入点: ${path}`);
    writeFileSync(
      path,
      page.replace(marker, () => `<div data-third-party-notices>${html}</div>`),
    );
    const md = path.replace(/\.html$/, ".md");
    if (existsSync(md))
      writeFileSync(md, injectLicenseMarkdown(readFileSync(md, "utf8"), markdown));
  }
  console.log(
    `许可证声明：${components.length} 个组件，${assets.length} 个二进制 / 大块资源，${locales.length} 个 Locale`,
  );
  return { components, warnings: [...warnings] };
};
