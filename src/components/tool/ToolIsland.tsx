import { Suspense } from "react";

import { useTool } from "./tool-loader";
import { type ToolAgentProps, ToolForm, type ToolServerProps, type ToolStrings } from "./ToolForm";

export type { ToolAgentProps, ToolServerProps, ToolStrings };

interface Props {
  toolId: string;
  strings: ToolStrings;
  agent?: ToolAgentProps;
  server?: ToolServerProps;
}

function LoadedTool({ toolId, ...props }: Props) {
  return <ToolForm tool={useTool(toolId)} {...props} />;
}

export default function ToolIsland(props: Props) {
  return (
    <Suspense>
      <LoadedTool {...props} />
    </Suspense>
  );
}
