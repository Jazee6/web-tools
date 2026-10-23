import { Suspense } from "react";

import { useTool } from "./tool-loader";
import {
  type ToolAgentProps,
  ToolForm,
  type ToolPresetProps,
  type ToolServerProps,
  type ToolStrings,
} from "./ToolForm";

export type { ToolAgentProps, ToolPresetProps, ToolServerProps, ToolStrings };

interface Props {
  toolId: string;
  strings: ToolStrings;
  agent?: ToolAgentProps;
  server?: ToolServerProps;
  variant?: ToolPresetProps;
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
