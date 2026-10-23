import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { m } from "@/paraglide/messages";

// Worker Tool 回报进度后才加载（不进首屏）；ratio 是 0–1
export default function RunProgress({ ratio }: { ratio: number }) {
  return (
    <Progress value={Math.round(ratio * 100)} data-progress>
      <ProgressLabel>{m.tool_progress()}</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
