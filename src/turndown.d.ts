// turndown 不带类型声明，这里声明 html-to-markdown 用到的最小部分
declare module "turndown" {
  interface Options {
    headingStyle?: "setext" | "atx";
    hr?: string;
    bulletListMarker?: "-" | "+" | "*";
    codeBlockStyle?: "indented" | "fenced";
    fence?: "```" | "~~~";
    emDelimiter?: "_" | "*";
    strongDelimiter?: "__" | "**";
    linkStyle?: "inlined" | "referenced";
  }
  type Filter = string | string[] | ((node: HTMLElement, options: Options) => boolean);
  interface Rule {
    filter: Filter;
    replacement: (content: string, node: HTMLElement, options: Options) => string;
  }
  class TurndownService {
    constructor(options?: Options);
    addRule(key: string, rule: Rule): this;
    remove(filter: Filter): this;
    turndown(html: string): string;
  }
  export default TurndownService;
}
