import { use } from "react";

import type { AnyTool } from "@/lib/tool-contract/define-tool";

// island 里按 id 懒加载 tool.ts，每个 Tool 一个分块，首屏不打包整个注册表。
const loaders = import.meta.glob<{ default: AnyTool }>("../../tools/*/tool.ts");

const loaded = new Map<string, AnyTool>();
const pending = new Map<string, Promise<AnyTool>>();

export const loadTool = (id: string): Promise<AnyTool> => {
  let promise = pending.get(id);
  if (!promise) {
    const loader = loaders[`../../tools/${id}/tool.ts`];
    if (!loader) throw new Error(`未知 Tool：${id}`);
    promise = loader().then((module) => {
      loaded.set(id, module.default);
      return module.default;
    });
    pending.set(id, promise);
  }
  return promise;
};

// 服务端渲染前页面已 await loadTool，这里同步拿到；客户端水合时挂起，React 保留服务端 HTML 直到分块加载完。
export const useTool = (id: string): AnyTool => loaded.get(id) ?? use(loadTool(id));
