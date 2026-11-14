// Tool 卡片网格（首页、Category 页）。只在服务端渲染，不水合。
import { cn } from "cn";

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

import { toolIcon } from "./icons";

interface Props {
  tools: { id: string; name: string; path: string; summary?: string }[];
  columns?: 2 | 3;
}

export default function ToolGrid({ tools, columns = 2 }: Props) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
      {tools.map((tool) => {
        const Icon = toolIcon(tool.id);
        return (
          <li key={tool.path}>
            <Item
              variant="outline"
              size={tool.summary ? "default" : "sm"}
              className="h-full"
              // 链接文字来自 Item 的子元素（ItemTitle）
              // oxlint-disable-next-line jsx-a11y/control-has-associated-label
              render={<a href={tool.path} />}
            >
              <ItemMedia variant="tile">
                <Icon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-2">{tool.name}</ItemTitle>
                {tool.summary && (
                  <ItemDescription className="line-clamp-3">{tool.summary}</ItemDescription>
                )}
              </ItemContent>
            </Item>
          </li>
        );
      })}
    </ul>
  );
}
