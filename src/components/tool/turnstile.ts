import { site } from "@/lib/site";
import { ToolError } from "@/lib/tool-contract/define-tool";

// Turnstile 只在 Server-assisted Tool 页按需加载：首次聚焦表单时预取脚本，提交时取 token。
// 每次提交渲染一个新 widget，拿到 token 后移除（token 一次性）。
interface Turnstile {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      execution: "execute";
      appearance: "interaction-only";
      callback: (token: string) => void;
      "error-callback": (code: string) => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ): string;
  execute(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let script: Promise<Turnstile> | undefined;

export const loadTurnstile = (): Promise<Turnstile> => {
  script ??= new Promise<Turnstile>((resolve, reject) => {
    const element = document.createElement("script");
    element.src = SCRIPT;
    element.async = true;
    element.addEventListener("load", () =>
      window.turnstile ? resolve(window.turnstile) : reject(new ToolError("verification_failed")),
    );
    element.addEventListener("error", () => reject(new ToolError("verification_failed")));
    document.head.append(element);
  }).catch((error: unknown) => {
    script = undefined;
    throw error instanceof ToolError ? error : new ToolError("verification_failed");
  });
  return script;
};

export const getTurnstileToken = async (container: HTMLElement): Promise<string> => {
  const turnstile = await loadTurnstile();
  let widgetId = "";
  try {
    return await new Promise<string>((resolve, reject) => {
      widgetId = turnstile.render(container, {
        sitekey: site.turnstileSiteKey,
        execution: "execute",
        appearance: "interaction-only",
        callback: resolve,
        "error-callback": (code) => reject(new ToolError("verification_failed", { detail: code })),
        // 交互式挑战超时或 token 过期时也要结束，否则提交按钮会一直转圈
        "expired-callback": () =>
          reject(new ToolError("verification_failed", { detail: "expired" })),
        "timeout-callback": () =>
          reject(new ToolError("verification_failed", { detail: "timeout" })),
      });
      turnstile.execute(widgetId);
    });
  } finally {
    if (widgetId) turnstile.remove(widgetId);
  }
};
