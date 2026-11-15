import { Empty, EmptyDescription } from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

// 分栏 Tool 还没有结果时占住右栏
export default function OutputPlaceholder() {
  return (
    <Empty className="border">
      <EmptyDescription>{m.tool_output_empty()}</EmptyDescription>
    </Empty>
  );
}
