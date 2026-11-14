import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Worker 里按需 import() 的 chunk 不能反过来 import Worker 入口（engine.worker-*.js）：WebKit 会把入口再实例化一次，
// exposeRun 注册两次，之后每个请求都跑两遍（roadmap M6 的 Extract Audio、Image to Text）。返回这样的 chunk 文件名
export const findWorkerEntryImporters = (assetsDir: string): string[] =>
  readdirSync(assetsDir).filter(
    (name) =>
      name.endsWith(".js") &&
      /from\s*"\.\/engine\.worker-/.test(readFileSync(join(assetsDir, name), "utf8")),
  );
