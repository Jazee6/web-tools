import { Suspense } from "react";

import { useTool } from "./tool-loader";
import { ToolForm, type ToolStrings } from "./ToolForm";

export type { ToolStrings };

interface Props {
  toolId: string;
  strings: ToolStrings;
}

function LoadedTool({ toolId, strings }: Props) {
  return <ToolForm tool={useTool(toolId)} strings={strings} />;
}

export default function ToolIsland(props: Props) {
  return (
    <Suspense>
      <LoadedTool {...props} />
    </Suspense>
  );
}
