import TurndownService from "turndown";

import { ToolError, type ToolContext } from "@/lib/tool-contract/define-tool";

// turndown 在浏览器里用 DOMParser 解析（所以这个 Tool 在主线程运行），在 Node 里用自带的 domino（ADR-0026）。
// 输出风格固定：ATX 标题、- 列表、``` 围栏代码块、内联链接。GFM 的表格、删除线和任务列表规则自己写：
// turndown-plugin-gfm 会把没有 <th> 的表格（Word、Google Docs 粘贴来的）原样留成 HTML，也不转义单元格里的 |

const closest = (node: Node, name: string): HTMLElement | undefined => {
  for (let current = node.parentNode; current; current = current.parentNode) {
    if (current.nodeName === name) return current as HTMLElement;
  }
  return undefined;
};

// 表格的第一行当作表头（GFM 表格必须有表头），不论它用的是 <th> 还是 <td>
const isFirstRow = (row: HTMLElement) => {
  const table = closest(row, "TABLE");
  return table !== undefined && table.querySelector("tr") === row;
};

const cellAlignment = (cell: Element) => {
  const value = (
    cell.getAttribute("align") ??
    /text-align:\s*(left|center|right)/i.exec(cell.getAttribute("style") ?? "")?.[1] ??
    ""
  ).toLowerCase();
  return value === "left" ? ":--" : value === "center" ? ":-:" : value === "right" ? "--:" : "---";
};

const cellsOf = (row: Element) =>
  Array.from(row.childNodes).filter(
    (child): child is Element => child.nodeName === "TH" || child.nodeName === "TD",
  );

const span = (cell: Element) => Math.max(1, Number(cell.getAttribute("colspan")) || 1);

const createService = () => {
  const service = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
  });

  service.remove(["script", "style", "noscript", "iframe", "template", "title", "head"]);

  // 列表符号后只留一个空格（turndown 默认对齐到 4 列），续行按符号宽度缩进
  service.addRule("listItem", {
    filter: "li",
    replacement: (content, node, options) => {
      const parent = node.parentNode as HTMLElement;
      let prefix = `${options.bulletListMarker} `;
      if (parent.nodeName === "OL") {
        const start = Number(parent.getAttribute("start")) || 1;
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = `${start + index}. `;
      }
      const body = content
        .replace(/^\n+/, "")
        .replace(/^(\[[ x]\]) +/, "$1 ")
        .replace(/\n+$/, "\n")
        .replace(/\n(?=.)/g, `\n${" ".repeat(prefix.length)}`);
      const next = node.nextSibling && !body.endsWith("\n") ? "\n" : "";
      return prefix + body + next;
    },
  });

  service.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: (content) => (content.trim() ? `~~${content}~~` : content),
  });

  service.addRule("taskListItem", {
    filter: (node) =>
      node.nodeName === "INPUT" &&
      node.getAttribute("type")?.toLowerCase() === "checkbox" &&
      closest(node, "LI") !== undefined,
    replacement: (_, node) => (node.hasAttribute("checked") ? "[x] " : "[ ] "),
  });

  // 没有 <code> 的 <pre>（GitHub 等站点的高亮代码块）也输出成围栏代码块
  service.addRule("preWithoutCode", {
    filter: (node) => node.nodeName === "PRE" && !node.querySelector("code"),
    replacement: (_, node) => {
      const code = (node.textContent ?? "").replace(/\n$/, "");
      const fence = code.includes("```") ? "````" : "```";
      return `\n\n${fence}\n${code}\n${fence}\n\n`;
    },
  });

  service.addRule("tableSection", {
    filter: ["thead", "tbody", "tfoot"],
    replacement: (content) => content,
  });

  // 单元格里的段落和换行用 <br> 连接，| 转义成 \|；colspan 补空单元格
  service.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: (content, node) => {
      const text = content
        .trim()
        .replace(/\s*\n+\s*/g, "<br>")
        .replaceAll("|", "\\|");
      return ` ${text} |${" |".repeat(span(node) - 1)}`;
    },
  });

  service.addRule("tableRow", {
    filter: "tr",
    replacement: (content, node) => {
      const row = `|${content}\n`;
      if (!isFirstRow(node)) return row;
      const delimiter = cellsOf(node)
        .flatMap((cell) => Array<string>(span(cell)).fill(cellAlignment(cell)))
        .join(" | ");
      return `${row}| ${delimiter} |\n`;
    },
  });

  service.addRule("tableCaption", {
    filter: "caption",
    replacement: (content) => `${content.trim()}\n\n`,
  });

  service.addRule("table", {
    filter: "table",
    replacement: (content) => (content.trim() ? `\n\n${content.trim()}\n\n` : ""),
  });

  return service;
};

let service: TurndownService | undefined;

export const htmlToMarkdown = (
  input: { html: string },
  _ctx: ToolContext = {},
): { markdown: string } => {
  service ??= createService();
  const markdown = service.turndown(input.html).trim();
  if (!markdown) throw new ToolError("empty", { field: "html" });
  return { markdown };
};
