import { CircleOffIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { capabilityNames } from "@/lib/runtime/capabilities";
import type { Capability } from "@/lib/tool-contract/define-tool";
import { m } from "@/paraglide/messages";

// 浏览器缺少 Tool 需要的能力时代替表单显示（architecture §13），只在探测到缺失时加载
export default function Unsupported({ missing }: { missing: Capability[] }) {
  return (
    <Empty data-unsupported={missing.join(" ")}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleOffIcon />
        </EmptyMedia>
        <EmptyTitle>{m.tool_unsupported_title()}</EmptyTitle>
        <EmptyDescription>
          {m.tool_unsupported_description({
            features: missing.map((capability) => capabilityNames[capability]).join(", "),
          })}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
